const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: path.join(__dirname, '.env') });

const nodemailer = require('nodemailer');

let transporter;

async function initMailer() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('[Mailer] Custom SMTP configuration loaded.');
  } else {
    // Fallback to test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[Mailer] Running in Testing mode (Ethereal test account). Emails will not reach real inboxes.');
  }
}
initMailer();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp, context = 'verify') {
  if (!transporter) {
    console.warn(`[OTP] Mailer not initialized yet. OTP for ${email} is ${otp}`);
    return;
  }
  try {
    let subject = 'Verify your Attendict account';
    let textBody = `Welcome to Attendict!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    let htmlHeading = 'Welcome to Attendict!';
    let htmlIntro = 'Your verification code is:';
    
    if (context === 'password_reset') {
      subject = 'Password Reset Request';
      textBody = `You requested a password reset.\n\nYour reset code is: ${otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.`;
      htmlHeading = 'Password Reset Request';
      htmlIntro = 'Your password reset code is:';
    }

    const info = await transporter.sendMail({
      from: `"Attendict" <${process.env.SMTP_USER || 'no-reply@attendict.test'}>`,
      to: email,
      subject: subject,
      text: textBody,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>${htmlHeading}</h2>
          <p>${htmlIntro}</p>
          <h1 style="color: #133e75; letter-spacing: 2px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    });
    console.log(`[OTP] Sent to ${email}`);
    if (!process.env.SMTP_USER) {
      console.log(`[OTP Test Mode] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error(`[OTP] Email failed for ${email}:`, error);
  }
}

// Make sure you create backend/serviceAccountKey.json from Firebase Console
let credential;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  credential = admin.credential.applicationDefault();
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(parsed);
  } catch (e) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT env var. Must be valid JSON.');
    process.exit(1);
  }
} else {
  const localKeyPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(localKeyPath)) {
    const serviceAccount = require('./serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  } else {
    console.error(
      'Missing Firebase Admin credentials. Provide GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT, or create backend/serviceAccountKey.json'

    );
    process.exit(1);
  }
}

admin.initializeApp({ credential });

const db = admin.firestore();
const app = express();
let rfidRegisterMode = null;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  return next(err);
});

const geoReverseCache = new Map();
let lastGeoReverseFetchAt = 0;

function normalizeGeoKey(lat, lon) {
  const latNum = typeof lat === 'number' ? lat : parseFloat(lat);
  const lonNum = typeof lon === 'number' ? lon : parseFloat(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
  return `${latNum.toFixed(6)},${lonNum.toFixed(6)}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchNominatimReverse(url) {
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Attendict/1.0 (contact: attendict@example.com)',
      Accept: 'application/json',
      'Accept-Language': 'en',
      Referer: 'http://localhost:3001/',
    },
  });
  return r;
}

async function fetchJson(url, options = {}) {
  const r = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Attendict/1.0 (contact: attendict@example.com)',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return { ok: false, status: r.status, text };
  }
  const json = await r.json().catch(() => null);
  return { ok: true, status: r.status, json };
}

function normalizeReverseResponse({ displayName, lat, lon, raw, provider }) {
  const addressFromObject = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    const parts = [
      obj.house_number,
      obj.road || obj.street || obj.pedestrian || obj.path,
      obj.neighbourhood || obj.quarter,
      obj.suburb || obj.village || obj.locality || obj.hamlet,
      obj.city_district || obj.district,
      obj.city || obj.town || obj.municipality,
      obj.state || obj.region || obj.province,
      obj.postcode,
      obj.country
    ].filter(Boolean);
    const uniqueParts = [...new Set(parts)];
    return uniqueParts.length ? uniqueParts.join(', ') : null;
  };

  let cleanAddress = null;
  
  if (provider === 'photon' && raw && Array.isArray(raw.features) && raw.features.length > 0) {
    cleanAddress = addressFromObject(raw.features[0].properties);
  } else if (raw && raw.address) {
    cleanAddress = addressFromObject(raw.address);
  } else if (raw && raw.properties) {
    cleanAddress = addressFromObject(raw.properties);
  } else {
    cleanAddress = addressFromObject(raw);
  }

  // Use the cleanly rebuilt address first. If it fails, fallback to standard display_name.
  let finalDisplayName = cleanAddress;

  if (!finalDisplayName) {
    finalDisplayName = typeof displayName === 'string' ? displayName.trim() : '';
    // Basic fallback strip if present
    if (raw && raw.address && raw.category) {
      const poiCategories = ['amenity', 'building', 'shop', 'office', 'leisure', 'historic', 'tourism', 'craft'];
      if (poiCategories.includes(raw.category)) {
        const poiName = raw.name || raw.address[raw.category] || raw.address[raw.type] || raw.address.poi;
        if (poiName && finalDisplayName.startsWith(poiName + ', ')) {
          finalDisplayName = finalDisplayName.substring(poiName.length + 2).trim();
        } else if (poiName === finalDisplayName) {
          finalDisplayName = '';
        }
      }
    }
  }

  if (!finalDisplayName) return null;
  
  return {
    display_name: finalDisplayName,
    lat: typeof lat === 'string' || typeof lat === 'number' ? String(lat) : undefined,
    lon: typeof lon === 'string' || typeof lon === 'number' ? String(lon) : undefined,
    raw: raw || null,
    provider: provider || 'unknown',
  };
}

app.get('/geo/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });

    const key = normalizeGeoKey(lat, lon);
    if (!key) return res.status(400).json({ error: 'Invalid lat/lon' });

    const cached = geoReverseCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.data);
    }

    const now = Date.now();
    const waitMs = Math.max(0, 1100 - (now - lastGeoReverseFetchAt));
    if (waitMs > 0) await sleep(waitMs);

    const baseLat = encodeURIComponent(key.split(',')[0]);
    const baseLon = encodeURIComponent(key.split(',')[1]);
    const contactEmail = encodeURIComponent(process.env.NOMINATIM_EMAIL || 'attendict@example.com');
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${baseLat}&lon=${baseLon}&zoom=18&addressdetails=1&namedetails=1&email=${contactEmail}`;
    const fallbackUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${baseLat}&lon=${baseLon}&zoom=18&addressdetails=1&email=${contactEmail}`;

    let r = await fetchNominatimReverse(url);
    lastGeoReverseFetchAt = Date.now();

    if (!r.ok && (r.status === 403 || r.status === 429)) {
      await sleep(2500);
      r = await fetchNominatimReverse(url);
      lastGeoReverseFetchAt = Date.now();
    }

    if (!r.ok && (r.status === 403 || r.status === 429)) {
      await sleep(2500);
      r = await fetchNominatimReverse(fallbackUrl);
      lastGeoReverseFetchAt = Date.now();
    }

    if (!r.ok && r.status === 403) {
      await sleep(3500);
      r = await fetchNominatimReverse(fallbackUrl);
      lastGeoReverseFetchAt = Date.now();
    }

    if (!r.ok) {
      if (r.status === 403 || r.status === 429) {
        const errors = [];

        const photonUrl = `https://photon.komoot.io/reverse?lat=${baseLat}&lon=${baseLon}`;
        const photon = await fetchJson(photonUrl);
        if (photon.ok && photon.json) {
          const feature = Array.isArray(photon.json?.features) ? photon.json.features[0] : null;
          const label = feature?.properties?.name || feature?.properties?.label || null;
          const normalized = normalizeReverseResponse({
            displayName: label,
            lat: key.split(',')[0],
            lon: key.split(',')[1],
            raw: photon.json,
            provider: 'photon',
          });
          if (normalized) {
            geoReverseCache.set(key, {
              expiresAt: Date.now() + 1000 * 60 * 60,
              data: normalized,
            });
            return res.json(normalized);
          }
          errors.push({ provider: 'photon', status: photon.status, details: 'No label in response' });
        } else {
          errors.push({ provider: 'photon', status: photon.status, details: photon.text });
        }

        const altUrl = `https://geocode.maps.co/reverse?lat=${baseLat}&lon=${baseLon}`;
        const alt = await fetchJson(altUrl);
        if (alt.ok && alt.json) {
          const normalized = normalizeReverseResponse({
            displayName: alt.json?.display_name || alt.json?.displayName || alt.json?.label || alt.json?.address,
            lat: alt.json?.lat || key.split(',')[0],
            lon: alt.json?.lon || key.split(',')[1],
            raw: alt.json,
            provider: 'geocode.maps.co',
          });
          if (normalized) {
            geoReverseCache.set(key, {
              expiresAt: Date.now() + 1000 * 60 * 60,
              data: normalized,
            });
            return res.json(normalized);
          }
          errors.push({ provider: 'geocode.maps.co', status: alt.status, details: 'No display_name in response' });
        } else {
          errors.push({ provider: 'geocode.maps.co', status: alt.status, details: alt.text });
        }

        const text = await r.text();
        return res.json({
          error: 'Reverse geocoding blocked',
          status: r.status,
          details: text,
          fallbacks: errors,
        });
      }

      const text = await r.text();
      return res.json({
        error: 'Nominatim error',
        status: r.status,
        details: text,
      });
    }

    const data = await r.json();

    const normalizedData = normalizeReverseResponse({
      displayName: data.display_name || data.name,
      lat: data.lat || key.split(',')[0],
      lon: data.lon || key.split(',')[1],
      raw: data,
      provider: 'nominatim'
    }) || data;

    geoReverseCache.set(key, {
      expiresAt: Date.now() + 1000 * 60 * 60,
      data: normalizedData,
    });

    return res.json(normalizedData);
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Unknown error' });
  }
});

// Simple startup test to verify Firestore credentials and connectivity
(async () => {
  try {
    const testSnap = await db.collection('users').limit(1).get();
    console.log('Firestore startup test OK. Users docs found:', testSnap.size);
  } catch (e) {
    console.error('Firestore startup test FAILED:', e);
  }
})();

function getEffectiveDayTag({ tagging, tagAM, tagPM }) {
  if (tagAM === 'Overtime' || tagPM === 'Overtime') {
    return 'Overtime';
  }
  if (tagging === 'Overtime') {
    return 'Overtime';
  }
  return 'Normal Hours';
}

function getTodayInfo() {
  const now = new Date();
  
  // Calculate Philippines time (UTC+8) explicitly
  // This is reliable regardless of machine-local timezone settings.
  const phOffset = 8 * 60; // Manila is UTC+8
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const phTime = new Date(utc + (phOffset * 60000));
  
  const year = phTime.getFullYear();
  const month = String(phTime.getMonth() + 1).padStart(2, '0');
  const day = String(phTime.getDate()).padStart(2, '0');
  
  const dateString = `${year}-${month}-${day}`;
  const timeString = phTime.toTimeString().slice(0, 8); // HH:MM:SS
  
  console.log(`[Time Sync] Now: ${now.toISOString()}, Manila: ${dateString} ${timeString}`);
  
  return { now: phTime, dateString, timeString };
}

/**
 * Ensures user's daily tagging fields are reset if the date has changed.
 */
async function ensureDailyUserTaggingReset(userId, userData, dateString) {
  if (userData.lastTagResetDate === dateString) {
    return { userData };
  }

  const updates = {
    tagging: null,
    todayAmTag: null,
    todayPmTag: null,
    lastTagResetDate: dateString
  };

  try {
    await db.collection('users').doc(userId).update(updates);
    return {
      userData: {
        ...userData,
        ...updates
      }
    };
  } catch (err) {
    console.error(`Failed to reset daily tagging for user ${userId}:`, err);
    // Return original data to avoid breaking the calling flow if update fails
    return { userData };
  }
}

function parseUserAgent(ua) {
  if (!ua || typeof ua !== 'string') {
    return {
      device: 'Unknown device',
      browser: 'Unknown',
    };
  }

  let browser = 'Unknown';
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'Internet Explorer';

  let device = 'Unknown device';
  if (/Windows NT/i.test(ua)) device = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) device = 'Mac';
  else if (/Android/i.test(ua)) device = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS';

  return { device, browser };
}

// Create a notification document for a specific user and role
async function createUserNotification(userId, { title, message, type, metadata }) {
  try {
    if (!userId) return;

    let role = null;
    try {
      const userSnap = await db.collection('users').doc(userId).get();
      if (userSnap.exists) {
        const user = userSnap.data();
        role = user.role || null;
      }
    } catch (e) {
      console.error('Fetch user for notification failed:', e);
    }

    const payload = {
      userId,
      role: role || null,
      title: title || '',
      message: message || '',
      type: type || 'info',
      metadata: metadata || null,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('notifications').add(payload);
  } catch (err) {
    console.error('Create notification error:', err);
  }
}


async function loginWithRole(req, res, expectedRole) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usersRef = db.collection('users');
    const usernameNormalized = String(username || '').trim();
    const usernameCandidates = Array.from(
      new Set([
        usernameNormalized,
        usernameNormalized.toLowerCase(),
        usernameNormalized.toUpperCase(),
      ])
    ).slice(0, 10);

    const snapshot = await usersRef
      .where('username', 'in', usernameCandidates)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user.role !== expectedRole) {
      return res.status(403).json({
        message: `You are not allowed to login here. Your role is '${user.role}', this login is for '${expectedRole}' only.`,
      });
    }

    return res.json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        position: user.position,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Unified login for intern (student) and staff
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameNormalized = String(username || '').trim();
    const passwordNormalized = String(password || '').trim();

    if (!usernameNormalized || !passwordNormalized) {

      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usersRef = db.collection('users');
    const usernameCandidates = Array.from(
      new Set([
        usernameNormalized,
        usernameNormalized.toLowerCase(),
        usernameNormalized.toUpperCase(),
      ])
    ).slice(0, 10);

    let snapshot = await usersRef.where('username', 'in', usernameCandidates).limit(1).get();
    if (snapshot.empty) {
      snapshot = await usersRef.where('email', '==', usernameNormalized).limit(1).get();
    }


    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Verify hashed password
    const storedPassword = String(user?.password || '').trim();
    const isPasswordValid = await bcrypt.compare(passwordNormalized, storedPassword);
    
    if (!storedPassword || !isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user.isVerified === false) {
      return res.status(403).json({ 
        errorCode: 'NOT_VERIFIED', 
        message: 'Account not verified. Please check your email for the OTP.', 
        email: user.email 
      });
    }

    const normalizedRole = user.role === 'intern' ? 'student' : user.role;

    if (normalizedRole !== 'student' && normalizedRole !== 'staff') {

      return res.status(403).json({ message: 'Only intern and staff accounts may log in here.' });
    }

    return res.json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        username: user.username,
        role: normalizedRole,

        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        position: user.position,
      },
    });
  } catch (err) {
    console.error('Unified login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Enroll fingerprint template for a staff user
app.post('/staff/fingerprint/enroll', async (req, res) => {
  try {
    const { staffId, username, email, template } = req.body || {};

    const staffIdNormalized = String(staffId || '').trim();
    const usernameNormalized = String(username || '').trim();
    const emailNormalized = String(email || '').trim();
    const templateBase64 = String(template || '').trim();

    if (!staffIdNormalized && !usernameNormalized && !emailNormalized) {
      return res.status(400).json({ message: 'staffId or username/email is required' });
    }

    if (!templateBase64) {
      return res.status(400).json({ message: 'template is required' });
    }

    let userRef = null;
    let userSnap = null;

    if (staffIdNormalized) {
      userRef = db.collection('users').doc(staffIdNormalized);
      userSnap = await userRef.get();
    }

    if (!userSnap || !userSnap.exists) {
      const usersRef = db.collection('users');
      let snap = null;

      if (usernameNormalized) {
        snap = await usersRef.where('username', '==', usernameNormalized).limit(1).get();
      }

      if ((!snap || snap.empty) && emailNormalized) {
        snap = await usersRef.where('email', '==', emailNormalized).limit(1).get();
      }

      if (!snap || snap.empty) {
        return res.status(404).json({ message: 'Staff user not found' });
      }

      userSnap = snap.docs[0];
      userRef = userSnap.ref;
    }

    const user = userSnap.data() || {};
    const roleNormalized = user.role === 'intern' ? 'student' : user.role;
    if (roleNormalized !== 'staff') {
      return res.status(403).json({ message: 'Only staff users can enroll fingerprint' });
    }

    await userRef.update({
      fingerprintTemplateBase64: templateBase64,
      fingerprintEnrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const resolvedStaffId = userSnap.id;

    await createUserNotification(resolvedStaffId, {
      title: 'Fingerprint Enrolled',
      message: 'Your fingerprint has been enrolled successfully.',
      type: 'fingerprint_enrollment',
      metadata: {},
    });

    return res.json({ message: 'Fingerprint enrolled successfully', staffId: resolvedStaffId });
  } catch (err) {
    console.error('Fingerprint enrollment error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: update today's attendance tagging for an intern
app.post('/admin/attendance/update-tagging', async (req, res) => {
  try {
    const { internId, tagging } = req.body || {};

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const cleanTag = typeof tagging === 'string' && tagging.trim() ? tagging.trim() : 'Normal Hours';

    const { dateString } = getTodayInfo();
    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('intern_attendance').doc(docId);
    const snap = await attendanceRef.get();

    if (!snap.exists) {
      // No attendance yet today; nothing to update, but not an error
      return res.json({ message: 'No attendance record for today to update', updated: false });
    }

    const data = snap.data();

    if (data.isLocked) {
      return res.status(400).json({ message: 'Attendance for today is locked and cannot be retagged.' });
    }

    const updatePayload = {
      // Always update the day-level tagging so counting logic (normal vs overtime)
      // can use the latest admin choice.
      tagging: cleanTag,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Only change per-session tags for sessions that do NOT yet have any
    // recorded time-in / time-out. This keeps past AM/PM sessions with
    // their original tagging, and only future sessions will pick up the
    // new admin tagging choice.
    const hasAMSession = data.timeInAM || data.timeOutAM;
    const hasPMSession = data.timeInPM || data.timeOutPM;

    if (!hasAMSession) {
      updatePayload.tagAM = cleanTag;
    }

    if (!hasPMSession) {
      updatePayload.tagPM = cleanTag;
    }

    await attendanceRef.set(updatePayload, { merge: true });

    return res.json({ message: 'Today attendance tagging updated', updated: true });
  } catch (err) {
    console.error('Admin update attendance tagging error:', err);

    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/users/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const { userAgent, location } = req.body || {};
    const { device, browser } = parseUserAgent(userAgent || '');

    const sessionsRef = db.collection('sessions');

    const existingSnap = await sessionsRef
      .where('userId', '==', id)
      .where('isCurrent', '==', true)
      .limit(1)
      .get();

    const now = new Date();

    let sessionDocRef;
    if (!existingSnap.empty) {
      sessionDocRef = existingSnap.docs[0].ref;
      await sessionDocRef.update({
        device,
        browser,
        location: location || 'Philippines',
        lastActive: admin.firestore.Timestamp.fromDate(now),
      });
    } else {
      const payload = {
        userId: id,
        device,
        browser,
        location: location || 'Philippines',
        isCurrent: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastActive: admin.firestore.Timestamp.fromDate(now),
      };
      sessionDocRef = await sessionsRef.add(payload);
    }

    const currentSnap = await sessionDocRef.get();
    return res.json({
      message: 'Session recorded',
      session: { id: currentSnap.id, ...currentSnap.data() },
    });
  } catch (err) {
    console.error('Create/update session error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('sessions')
      .where('userId', '==', id)
      .get();

    const sessions = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const ta = a.lastActive && a.lastActive.toMillis ? a.lastActive.toMillis() : 0;
        const tb = b.lastActive && b.lastActive.toMillis ? b.lastActive.toMillis() : 0;
        return tb - ta;
      });

    return res.json({
      message: 'Sessions fetched',
      sessions,
    });
  } catch (err) {
    console.error('Fetch sessions error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/users/:id/sessions/:sessionId', async (req, res) => {
  try {
    const { id, sessionId } = req.params;
    if (!id || !sessionId) {
      return res.status(400).json({ message: 'User id and sessionId are required' });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const snap = await sessionRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const data = snap.data();
    if (data.userId !== id) {
      return res.status(403).json({ message: 'Session does not belong to this user' });
    }
    await sessionRef.delete();
    return res.json({ message: 'Session revoked' });
  } catch (err) {
    console.error('Delete session error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/users/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('sessions')
      .where('userId', '==', id)
      .get();

    if (snap.empty) {
      return res.json({ message: 'No sessions to revoke', deleted: 0 });
    }

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return res.json({ message: 'All sessions revoked', deleted: snap.size });
  } catch (err) {
    console.error('Delete all sessions error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete all notifications for a specific user
app.delete('/notifications/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('notifications')
      .where('userId', '==', id)
      .get();

    if (snap.empty) {
      return res.json({ message: 'No notifications to delete', deleted: 0 });
    }

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return res.json({ message: 'Notifications deleted', deleted: snap.size });
  } catch (err) {
    console.error('Delete notifications error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete selected notifications for a specific user, matched by message text
app.post('/notifications/user/:id/delete-selected', async (req, res) => {
  try {
    const { id } = req.params;
    const { messages } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    // Firestore "in" filter supports up to 10 values; if more, we'll chunk
    const chunkSize = 10;
    let totalDeleted = 0;

    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize);
      const snap = await db
        .collection('notifications')
        .where('userId', '==', id)
        .where('message', 'in', chunk)
        .get();

      if (snap.empty) continue;

      const batch = db.batch();
      snap.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      totalDeleted += snap.size;
    }

    return res.json({ message: 'Selected notifications deleted', deleted: totalDeleted });
  } catch (err) {
    console.error('Delete selected notifications error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch notifications for a specific user
app.get('/notifications/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('notifications')
      .where('userId', '==', id)
      .get();

    const notifications = snap.docs
      .map((doc) => {
        const data = doc.data();
        let createdAtIso = null;
        if (data.createdAt) {
          if (typeof data.createdAt.toDate === 'function') {
            createdAtIso = data.createdAt.toDate().toISOString();
          } else if (typeof data.createdAt === 'string') {
            createdAtIso = data.createdAt;
          }
        }
        return {
          id: doc.id,
          ...data,
          createdAt: createdAtIso,
        };
      })
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });


    return res.json({
      message: 'Notifications fetched',
      notifications,
    });
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin login only; staff and intern login endpoints have been removed
app.post('/auth/admin/login', async (req, res) => {
  await loginWithRole(req, res, 'admin');
});

app.post('/auth/intern/register', async (req, res) => {
  try {
    const {
      username,
      firstName,
      middleName,
      lastName,
      email,
      schoolOrUniversity,
      assignedOffice,
      position,
      password,
    } = req.body;

    if (!username || !firstName || !lastName || !email || !schoolOrUniversity || !assignedOffice || !position || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const usersRef = db.collection('users');

    const existingSnap = await usersRef.where('username', '==', username).limit(1).get();
    if (!existingSnap.empty) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const { dateString } = getTodayInfo();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    const docRef = await db.collection('users').add({
      username,
      firstName,
      middleName: middleName || '',

      lastName,
      email,
      schoolOrUniversity,
      assignedOffice,
      position,
      role: 'student',
      tagging: 'Normal Hours',
      todayAmTag: 'Normal Hours',
      todayPmTag: 'Normal Hours',
      taggingLastResetDate: dateString,

      password: hashedPassword,
      isVerified: false,
      otpCode,
      otpExpiresAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sendOtpEmail(email, otpCode);

    return res.status(201).json({
      message: 'Intern registered successfully',
      userId: docRef.id,
    });
  } catch (err) {
    console.error('Intern register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: register a new staff member securely
app.post('/auth/staff/register', async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      position,
      assignedOffice,
      phone,
      gender,
      dateOfBirth,
      address,
    } = req.body;

    if (!username || !password || !firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Username, password, first name, last name, and email are required' });
    }

    const usersRef = db.collection('users');
    const existingSnap = await usersRef.where('username', '==', username).limit(1).get();
    if (!existingSnap.empty) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    const docRef = await usersRef.add({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'staff',
      position: position || '',
      assignedOffice: assignedOffice || '',
      phone: phone || '',
      gender: gender || '',
      dateOfBirth: dateOfBirth || '',
      address: address || '',
      isVerified: false,
      otpCode,
      otpExpiresAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sendOtpEmail(email, otpCode);

    return res.status(201).json({
      message: 'Staff registered successfully',
      userId: docRef.id,
    });
  } catch (err) {
    console.error('Staff register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const snap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = snap.docs[0];
    const user = userDoc.data();

    if (user.isVerified) {
      return res.json({ message: 'Account is already verified' });
    }

    if (user.otpCode !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    const now = new Date();
    const expiresAt = user.otpExpiresAt ? user.otpExpiresAt.toDate ? user.otpExpiresAt.toDate() : new Date(user.otpExpiresAt) : null;
    if (!expiresAt || now > expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    await userDoc.ref.update({
      isVerified: true,
      otpCode: admin.firestore.FieldValue.delete(),
      otpExpiresAt: admin.firestore.FieldValue.delete(),
    });

    return res.json({ message: 'Account verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const snap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) return res.status(404).json({ message: 'User not found' });

    const userDoc = snap.docs[0];
    const user = userDoc.data();

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000);

    await userDoc.ref.update({
      otpCode,
      otpExpiresAt,
    });

    await sendOtpEmail(email, otpCode);

    return res.json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const snap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) {
      // Default success to not leak emails
      return res.json({ message: 'If that email exists, an OTP has been sent.' });
    }

    const userDoc = snap.docs[0];
    
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000);

    await userDoc.ref.update({
      resetOtpCode: otpCode,
      resetOtpExpiresAt: otpExpiresAt,
    });

    await sendOtpEmail(email, otpCode, 'password_reset');

    return res.json({ message: 'If that email exists, an OTP has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Required fields missing' });

    const snap = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) return res.status(404).json({ message: 'User not found' });

    const userDoc = snap.docs[0];
    const user = userDoc.data();

    if (!user.resetOtpCode || user.resetOtpCode !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    const now = new Date();
    const expiresAt = user.resetOtpExpiresAt ? user.resetOtpExpiresAt.toDate ? user.resetOtpExpiresAt.toDate() : new Date(user.resetOtpExpiresAt) : null;
    if (!expiresAt || now > expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userDoc.ref.update({
      password: hashedPassword,
      resetOtpCode: admin.firestore.FieldValue.delete(),
      resetOtpExpiresAt: admin.firestore.FieldValue.delete(),
    });

    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch full user document by ID (for name formatting, etc.)
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const userRef = db.collection('users').doc(id);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'User fetched',
      user: { id: snap.id, ...snap.data() },
    });
  } catch (err) {
    console.error('Fetch user error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/staff', async (req, res) => {
  try {
    const usersSnap = await db.collection('users').where('role', '==', 'staff').get();

    if (usersSnap.empty) {
      return res.json({ message: 'No staff found', staff: [] });
    }

    const staff = usersSnap.docs.map((docSnap) => {
      const u = docSnap.data() || {};
      return {
        id: docSnap.id,
        username: u.username || '',
        email: u.email || '',
        role: u.role || '',
        position: u.position || '',
        firstName: u.firstName || '',
        middleName: u.middleName || '',
        lastName: u.lastName || '',
        staffStatus: u.staffStatus || '',
      };
    });

    // Pull latest staffStatus from staff_attendance for each staff member
    for (const s of staff) {
      try {
        const attSnap = await db.collection('staff_attendance')
          .where('staffId', '==', s.id)
          .get();

        if (!attSnap.empty) {
          const docs = attSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          docs.sort((a, b) => {
            const ta = (a.updatedAt && a.updatedAt.toMillis ? a.updatedAt.toMillis() : 0)
              || (a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0);
            const tb = (b.updatedAt && b.updatedAt.toMillis ? b.updatedAt.toMillis() : 0)
              || (b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0);
            return tb - ta;
          });

          const latestWithStatus = docs.find(
            (d) => typeof d.staffStatus === 'string' && d.staffStatus.trim() !== ''
          );
          if (latestWithStatus) {
            s.staffStatus = latestWithStatus.staffStatus.trim();
          }
        }
      } catch (e) {
        // Skip silently if staff_attendance lookup fails for this staff member
      }
    }

    staff.sort((a, b) => {
      const an = `${a.lastName} ${a.firstName} ${a.middleName}`.trim().toLowerCase();
      const bn = `${b.lastName} ${b.firstName} ${b.middleName}`.trim().toLowerCase();
      return an.localeCompare(bn);
    });

    return res.json({ message: 'Staff fetched', staff });
  } catch (err) {
    console.error('Fetch staff error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/staff/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Staff id is required' });
    }

    let staffStatus = null;
    let updatedAt = null;
    let source = null;

    try {
      const userSnap = await db.collection('users').doc(id).get();
      if (userSnap.exists) {
        const u = userSnap.data() || {};
        if (typeof u.staffStatus === 'string' && u.staffStatus.trim() !== '') {
          staffStatus = u.staffStatus.trim();
          updatedAt = u.updatedAt || null;
          source = 'users';
        }
      }
    } catch (e) {
      console.error('Fetch staffStatus from users failed:', e);
    }

    if (!staffStatus) {
      const collectionsToTry = ['staff_attendance', 'staffAttendance', 'attendance_staff', 'staff_status'];

      for (const col of collectionsToTry) {
        try {
          const tryFields = ['staffId', 'staffid'];
          let snap = null;
          for (const field of tryFields) {
            const s = await db.collection(col).where(field, '==', id).get();
            if (!s.empty) {
              snap = s;
              break;
            }
          }

          if (!snap || snap.empty) continue;

          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          docs.sort((a, b) => {
            const ta = (a.updatedAt && a.updatedAt.toMillis ? a.updatedAt.toMillis() : 0)
              || (a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0);
            const tb = (b.updatedAt && b.updatedAt.toMillis ? b.updatedAt.toMillis() : 0)
              || (b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0);
            return tb - ta;
          });

          const latest = docs[0] || null;
          if (latest && typeof latest.staffStatus === 'string' && latest.staffStatus.trim() !== '') {
            staffStatus = latest.staffStatus.trim();
            updatedAt = latest.updatedAt || latest.createdAt || null;
            source = col;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    return res.json({
      message: 'Staff status fetched',
      staffId: id,
      staffStatus: staffStatus || '',
      updatedAt: updatedAt || null,
      source: source || null,
    });
  } catch (err) {
    console.error('Fetch staff status error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/attendance/intern/time-in', async (req, res) => {
  try {
    const { internId, location } = req.body;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const { now, dateString, timeString } = getTodayInfo();

    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('intern_attendance').doc(docId);
    const snapshot = await attendanceRef.get();

    // Read the intern's current tagging (Normal Hours / Overtime) from users
    // including per-session defaults for AM/PM so that admin AM/PM tag choices
    // apply even if they were set before today's attendance exists.
    let userTagging = 'Normal Hours';
    let userTagAM = null;
    let userTagPM = null;
    try {
      const userSnap = await db.collection('users').doc(internId).get();
      if (userSnap.exists) {
        let user = userSnap.data();

        const resetResult = await ensureDailyUserTaggingReset(internId, user, dateString);
        user = resetResult.userData;

        if (user && typeof user.tagging === 'string' && user.tagging.trim()) {
          userTagging = user.tagging.trim();
        }
        if (user && typeof user.todayAmTag === 'string' && user.todayAmTag.trim()) {
          userTagAM = user.todayAmTag.trim();
        }
        if (user && typeof user.todayPmTag === 'string' && user.todayPmTag.trim()) {
          userTagPM = user.todayPmTag.trim();
        }
      }
    } catch (e) {
      console.error('Failed to read user tagging for attendance:', e);
    }

    // Decide session purely from current clock time
    const hour = now.getHours();
    const minute = now.getMinutes();
    const session = hour < 12 ? 'AM' : 'PM';

    let payload;
    let existing = null;

    const normalizeLocation = (loc) => {
      if (!loc) return '';
      if (typeof loc === 'string') return loc.trim().toLowerCase();
      if (typeof loc.address === 'string' && loc.address.trim()) return loc.address.trim().toLowerCase();
      const lat = typeof loc.latitude === 'number' ? loc.latitude : null;
      const lng = typeof loc.longitude === 'number' ? loc.longitude : null;
      if (lat !== null && lng !== null) return `${lat}, ${lng}`;
      return '';
    };

    const AUTO_APPROVE_LOCATION = 'm. roxas drive, lalom, santa isabel, calapan, oriental mindoro, mimaropa, philippines';
    const isAutoApprove = location && normalizeLocation(location) === AUTO_APPROVE_LOCATION;

    if (snapshot.exists) {
      existing = snapshot.data();

      if (existing.isLocked) {
        return res.status(400).json({ message: 'Attendance already locked for this date.' });
      }

      const { timeInAM, timeInPM } = existing;

      // Prevent multiple time-ins for the same session
      if (session === 'AM' && timeInAM) {
        return res.status(400).json({ message: 'You have already timed in for AM today.' });
      }
      if (session === 'PM' && timeInPM) {
        return res.status(400).json({ message: 'You have already timed in for PM today.' });
      }
    }

    const isLate = hour > 8 || (hour === 8 && minute > 0);

    if (!existing) {
      payload = {
        internId,
        date: dateString,
        timeInAM: session === 'AM' ? timeString : null,
        timeOutAM: null,
        timeInPM: session === 'PM' ? timeString : null,
        timeOutPM: null,
        totalMinutesAM: null,
        totalMinutesPM: null,
        totalMinutes: null,
        statusAM: session === 'AM' ? (isLate ? 'Late' : 'Present') : null,
        statusPM: session === 'PM' ? (isLate ? 'Late' : 'Present') : null,
        // store tagging snapshot for this day/session
        tagging: userTagging,
        // Use per-session default tags when available, falling back to day-level tagging
        tagAM: session === 'AM' ? (userTagAM || userTagging) : null,
        tagPM: session === 'PM' ? (userTagPM || userTagging) : null,
        locationAM: session === 'AM' && location ? location : null,
        locationPM: session === 'PM' && location ? location : null,
        validationStatusAM: session === 'AM' && isAutoApprove ? 'Approved' : 'Pending',
        validationStatusPM: session === 'PM' && isAutoApprove ? 'Approved' : 'Pending',

        isLocked: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
    } else {
      // Start from existing document and only update fields for the current session

      payload = {
        ...existing,
        internId,
        date: dateString,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (session === 'AM') {
        payload.timeInAM = timeString;
        payload.statusAM = isLate ? 'Late' : 'Present';
        // Keep any existing tagging choice but update day-level if admin changed it
        payload.tagging = userTagging;
        // For AM session, prefer per-session default then fall back to day-level
        payload.tagAM = userTagAM || userTagging;
        if (location) {
          payload.locationAM = location;
          if (isAutoApprove) {
            payload.validationStatusAM = 'Approved';
          }
        } else if (!existing.validationStatusAM) {
          payload.validationStatusAM = 'Pending';
        }
      } else {
        payload.timeInPM = timeString;
        payload.tagging = userTagging;
        // For PM session, prefer per-session default then fall back to day-level
        payload.tagPM = userTagPM || userTagging;
        if (location) {
          payload.locationPM = location;
          if (isAutoApprove) {
            payload.validationStatusPM = 'Approved';
          }
        } else if (!existing.validationStatusPM) {
          payload.validationStatusPM = 'Pending';
        }

      }
    }

    await attendanceRef.set(payload, { merge: true });

    const statusForSession = isLate ? 'Late' : 'Present';

    // Build a plain JSON snapshot of the attendance record without Firestore FieldValue
    const responseRecord = {
      internId,
      date: dateString,
      timeInAM: payload.timeInAM || null,
      timeOutAM: payload.timeOutAM || null,
      timeInPM: payload.timeInPM || null,
      timeOutPM: payload.timeOutPM || null,
      totalMinutesAM: payload.totalMinutesAM ?? null,
      totalMinutesPM: payload.totalMinutesPM ?? null,
      totalMinutes: payload.totalMinutes ?? null,
      statusAM: payload.statusAM || null,
      statusPM: payload.statusPM || null,
      tagging: payload.tagging || null,
      tagAM: payload.tagAM || null,
      tagPM: payload.tagPM || null,

      locationAM: payload.locationAM || null,
      locationPM: payload.locationPM || null,
      isLocked: !!payload.isLocked,
    };

    // Also write a notification for this time in (saved per user & role)
    let timeInLocation = null;
    const rawLocation = session === 'AM' ? (payload.locationAM || null) : (payload.locationPM || null);
    if (rawLocation) {
      if (typeof rawLocation === 'string') {
        timeInLocation = rawLocation;
      } else if (typeof rawLocation.address === 'string' && rawLocation.address.trim() !== '') {
        timeInLocation = rawLocation.address;
      }
    }
    const d = new Date(`${dateString}T${timeString}`);
    const fDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
    const fTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(d);

    await createUserNotification(internId, {
      title: 'Time In Recorded',
      message: `You timed in for ${session} on ${fDate} at ${fTime}.`,

      type: 'time_in',
      metadata: {
        date: dateString,
        session,
        time: timeString,
        attendanceDocId: docId,
        status: statusForSession,
        timeInLocation,

      },
    });

    // Return only plain JSON values (no FieldValue objects)
    return res.json({
      message: 'Time in recorded',
      data: {
        date: dateString,
        session,
        timeIn: session === 'AM' ? timeString : timeString,
        timeOut: null,
        lastActionTime: timeString,
        status: statusForSession,
        record: responseRecord,
      },
    });
  } catch (err) {
    console.error('Time-in error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/attendance/intern/time-out', async (req, res) => {
  try {
    const { internId } = req.body;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const { now, dateString, timeString } = getTodayInfo();

    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('intern_attendance').doc(docId);

    const snapshot = await attendanceRef.get();

    if (!snapshot.exists) {
      return res.status(400).json({ message: 'No time-in record found for today.' });
    }

    const data = snapshot.data();

    if (data.isLocked) {
      return res.status(400).json({ message: 'Attendance already locked for this date.' });
    }

    let session = null;
    let timeInForSession = null;

    // Determine which session is currently open (AM first, then PM)
    if (data.timeInAM && !data.timeOutAM) {
      session = 'AM';
      timeInForSession = data.timeInAM;
    } else if (data.timeInPM && !data.timeOutPM) {
      session = 'PM';
      timeInForSession = data.timeInPM;
    } else if (!data.timeInAM && !data.timeInPM) {
      return res.status(400).json({ message: 'Cannot time out without time in.' });
    } else {
      return res.status(400).json({ message: 'You have already timed out for all sessions today.' });
    }

    const [inHour, inMinute, inSecond] = timeInForSession.split(':').map(Number);
    const timeInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), inHour, inMinute, inSecond || 0);
    const diffMs = now.getTime() - timeInDate.getTime();
    const totalMinutesForSession = Math.max(0, Math.round(diffMs / 60000));

    const updated = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (session === 'AM') {
      updated.timeOutAM = timeString;
      updated.totalMinutesAM = totalMinutesForSession;
    } else {
      updated.timeOutPM = timeString;
      updated.totalMinutesPM = totalMinutesForSession;
    }

    const totalMinutesAM = updated.totalMinutesAM ?? data.totalMinutesAM ?? 0;
    const totalMinutesPM = updated.totalMinutesPM ?? data.totalMinutesPM ?? 0;
    const totalMinutes = totalMinutesAM + totalMinutesPM;
    updated.totalMinutes = totalMinutes;

    // Derive counted normal hours vs overtime based on tagging
    const dayTag = getEffectiveDayTag({
      tagging: data.tagging,
      tagAM: data.tagAM,
      tagPM: data.tagPM,
    });
    const eightHoursMinutes = 8 * 60;
    let normalCountMinutes = 0;
    let overtimeMinutes = 0;

    if (dayTag === 'Overtime') {
      if (totalMinutes > eightHoursMinutes) {
        overtimeMinutes = totalMinutes - eightHoursMinutes;
      }
    } else {
      normalCountMinutes = Math.min(totalMinutes, eightHoursMinutes);
    }

    updated.normalCountMinutes = normalCountMinutes;
    updated.overtimeMinutes = overtimeMinutes;
    // Convenience: store total hours as decimal string (raw total for the day)
    updated.totalHours = (totalMinutes / 60).toFixed(2);

    // Also store the counted total minutes/hours for the day, which respects
    // Normal Hours vs Overtime tagging. For Normal Hours, cap at 8h; for
    // Overtime, count all minutes as worked.
    const countedTotalMinutes = dayTag === 'Overtime'
      ? Math.max(0, totalMinutes)
      : Math.max(0, normalCountMinutes);
    updated.countedTotalMinutes = countedTotalMinutes;
    updated.countedTotalHours = (countedTotalMinutes / 60).toFixed(2);


    await attendanceRef.set(updated, { merge: true });

    // Determine status for the session from existing doc plus our updates
    const merged = { ...data, ...updated };
    const statusForSession = session === 'AM' ? (merged.statusAM || '') : (merged.statusPM || '');

    // Build a plain JSON snapshot of the attendance record without Firestore FieldValue
    const responseRecord = {
      internId: merged.internId,
      date: merged.date,
      timeInAM: merged.timeInAM || null,
      timeOutAM: merged.timeOutAM || null,
      timeInPM: merged.timeInPM || null,
      timeOutPM: merged.timeOutPM || null,
      totalMinutesAM: merged.totalMinutesAM ?? null,
      totalMinutesPM: merged.totalMinutesPM ?? null,
      totalMinutes: merged.totalMinutes ?? null,
      normalCountMinutes: merged.normalCountMinutes ?? null,
      overtimeMinutes: merged.overtimeMinutes ?? null,
      totalHours: merged.totalHours || null,
      countedTotalMinutes: merged.countedTotalMinutes ?? null,
      countedTotalHours: merged.countedTotalHours || null,

      statusAM: merged.statusAM || null,
      statusPM: merged.statusPM || null,
      locationAM: merged.locationAM || null,
      locationPM: merged.locationPM || null,
      isLocked: !!merged.isLocked,
    };

    // Also write a notification for this time out (saved per user & role)
    const d = new Date(`${dateString}T${timeString}`);
    const fDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
    const fTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(d);

    await createUserNotification(internId, {
      title: 'Time Out Recorded',
      message: `You timed out for ${session} on ${fDate} at ${fTime}.`,

      type: 'time_out',
      metadata: {
        date: dateString,
        session,
        time: timeString,
        attendanceDocId: docId,
        status: statusForSession,
      },
    });

    // Return only plain JSON values (no FieldValue objects)
    return res.json({
      message: 'Time out recorded',
      data: {
        date: dateString,
        session,
        // For convenience, include both times for this day
        timeIn: session === 'AM' ? merged.timeInAM : merged.timeInPM,
        timeOut: session === 'AM' ? merged.timeOutAM : merged.timeOutPM,
        lastActionTime: timeString,
        status: statusForSession,
        record: responseRecord,
      },
    });
  } catch (err) {
    console.error('Time-out error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: fetch today's attendance records joined with intern user info
app.get('/admin/attendance/today-interns', async (req, res) => {
  try {
    const { date } = req.query || {};

    const { dateString: todayString } = getTodayInfo();
    const dateString = typeof date === 'string' && date.trim() ? date.trim() : todayString;

    const usersRef = db.collection('users');
    const usersSnap = await usersRef.where('role', '==', 'student').get();

    if (usersSnap.empty) {
      return res.json({ message: 'No student interns found', interns: [] });
    }

    const interns = [];

    for (const docSnap of usersSnap.docs) {
      let user = docSnap.data();

      const position = (user.position || '').toLowerCase();
      if (position !== 'intern') {
        continue;
      }

      const internId = docSnap.id;

      if (dateString === todayString) {
        const resetResult = await ensureDailyUserTaggingReset(internId, user, todayString);
        user = resetResult.userData;
      }

      const attendanceId = `${internId}_${dateString}`;
      const attSnap = await db.collection('intern_attendance').doc(attendanceId).get();

      let attendance = null;
      if (attSnap.exists) {
        const d = attSnap.data();
        attendance = {
          date: d.date || dateString,
          timeInAM: d.timeInAM || null,
          timeOutAM: d.timeOutAM || null,
          timeInPM: d.timeInPM || null,
          timeOutPM: d.timeOutPM || null,
          tagging: d.tagging || null,
          tagAM: d.tagAM || null,
          tagPM: d.tagPM || null,
          statusAM: d.statusAM || null,
          statusPM: d.statusPM || null,
          locationAM: d.locationAM || null,
          locationPM: d.locationPM || null,
          validationStatusAM: d.validationStatusAM || null,
          rejectReasonAM: d.rejectReasonAM || null,
          validationStatusPM: d.validationStatusPM || null,
          rejectReasonPM: d.rejectReasonPM || null,
        };
      }

      interns.push({
        id: internId,
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
        position: user.position || '',
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        photoURL: user.photoURL || user.photoUrl || user.avatarUrl || user.profilePicture || '',
        ojtRequiredHours: user.ojtRequiredHours ?? null,
        tagging: (attendance && attendance.tagging) || user.tagging || null,
        todayAmTag: (attendance && attendance.tagAM) || user.todayAmTag || null,
        todayPmTag: (attendance && attendance.tagPM) || user.todayPmTag || null,
        timeInAM: attendance ? attendance.timeInAM : null,
        timeOutAM: attendance ? attendance.timeOutAM : null,
        timeInPM: attendance ? attendance.timeInPM : null,
        timeOutPM: attendance ? attendance.timeOutPM : null,
        locationAM: attendance ? attendance.locationAM : null,
        locationPM: attendance ? attendance.locationPM : null,
        validationStatusAM: attendance ? attendance.validationStatusAM : null,
        rejectReasonAM: attendance ? attendance.rejectReasonAM : null,
        validationStatusPM: attendance ? attendance.validationStatusPM : null,
        rejectReasonPM: attendance ? attendance.rejectReasonPM : null,
      });
    }

    return res.json({
      message: 'Today intern attendance fetched',
      date: dateString,
      interns,
    });
  } catch (err) {
    console.error('Admin fetch today intern attendance error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: fetch OJT total counted hours per intern
app.get('/admin/ojt-summary', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const usersSnap = await usersRef.where('role', '==', 'student').get();

    if (usersSnap.empty) {
      return res.json({ message: 'No student interns found', interns: [] });
    }

    const interns = [];

    for (const docSnap of usersSnap.docs) {
      const user = docSnap.data();
      if (user.isArchived) {
        continue;
      }
      const position = (user.position || '').toLowerCase();
      if (position !== 'intern') {
        continue;
      }

      const internId = docSnap.id;
      const attSnap = await db
        .collection('intern_attendance')
        .where('internId', '==', internId)
        .get();

      let totalCountedMinutes = 0;

      attSnap.forEach((d) => {
        const data = d.data();

        const totalMinutesAM = typeof data.totalMinutesAM === 'number' ? data.totalMinutesAM : 0;
        const totalMinutesPM = typeof data.totalMinutesPM === 'number' ? data.totalMinutesPM : 0;

        const fourHoursMinutes = 4 * 60;

        const tagAM = (data.tagAM || data.tagging || 'Normal Hours').trim();
        const tagPM = (data.tagPM || data.tagging || 'Normal Hours').trim();

        let countedAM = 0;
        let countedPM = 0;

        if (data.validationStatusAM === 'Approved' && (data.timeInAM || data.timeOutAM)) {
          if (tagAM === 'Overtime') {
            countedAM = Math.max(0, totalMinutesAM);
          } else {
            countedAM = Math.min(Math.max(0, totalMinutesAM), fourHoursMinutes);
          }
        }

        if (data.validationStatusPM === 'Approved' && (data.timeInPM || data.timeOutPM)) {
          if (tagPM === 'Overtime') {
            countedPM = Math.max(0, totalMinutesPM);
          } else {
            countedPM = Math.min(Math.max(0, totalMinutesPM), fourHoursMinutes);
          }
        }

        totalCountedMinutes += countedAM + countedPM;
      });

      const totalHoursDecimal = totalCountedMinutes / 60;
      const totalHoursLabel = (() => {
        const mins = Math.round(totalCountedMinutes);
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
      })();

      const requiredHours = Number.isFinite(user.ojtRequiredHours)
        ? user.ojtRequiredHours
        : null;

      let remainingHours = null;
      let remainingHoursLabel = null;

      if (requiredHours !== null) {
        const rawRemaining = requiredHours - totalHoursDecimal;
        const clampedRemaining = Math.max(0, rawRemaining);
        remainingHours = Number(clampedRemaining.toFixed(2));

        const remainingMinutes = Math.round(clampedRemaining * 60);
        const rh = Math.floor(remainingMinutes / 60);
        const rm = remainingMinutes % 60;
        remainingHoursLabel = `${rh}h ${rm}m`;

        try {
          await db.collection('users').doc(internId).update({
            ojtRemainingHours: remainingHours,
          });
        } catch (e) {
          console.error('Failed to update ojtRemainingHours for intern', internId, e);
        }
      }

      interns.push({
        id: internId,
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
        position: user.position || '',
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        ojtRequiredHours: user.ojtRequiredHours ?? null,
        ojtRemainingHours: remainingHours,
        ojtRemainingHoursLabel: remainingHoursLabel,
        ojtTotalMinutes: totalCountedMinutes,
        ojtTotalHours: totalHoursDecimal.toFixed(2),
        ojtTotalHoursLabel: totalHoursLabel,
      });
    }

    return res.json({
      message: 'OJT summary fetched',
      interns,
    });
  } catch (err) {
    console.error('Admin OJT summary error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: retag a specific AM or PM session for a given date (or today if date omitted)
app.post('/admin/attendance/retag-session', async (req, res) => {
  try {
    const { internId, session, tag, date } = req.body || {};

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }
    if (!session || !['AM', 'PM'].includes(session)) {
      return res.status(400).json({ message: "session must be 'AM' or 'PM'" });
    }

    const cleanTag = typeof tag === 'string' && tag.trim() ? tag.trim() : 'Normal Hours';

    const { dateString: todayString } = getTodayInfo();
    const dateString = typeof date === 'string' && date.trim() ? date.trim() : todayString;

    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('intern_attendance').doc(docId);
    const snap = await attendanceRef.get();

    if (!snap.exists) {
      return res.status(404).json({ message: 'Attendance record not found for given date' });
    }

    const data = snap.data();

    if (data.isLocked) {
      return res.status(400).json({ message: 'Attendance for this date is locked and cannot be retagged.' });
    }

    const updatePayload = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (session === 'AM') {
      updatePayload.tagAM = cleanTag;
    } else {
      updatePayload.tagPM = cleanTag;
    }

    // Recompute counted minutes (normal vs overtime) using effective day tag
    const totalMinutesAM = data.totalMinutesAM ?? 0;
    const totalMinutesPM = data.totalMinutesPM ?? 0;
    const totalMinutes = totalMinutesAM + totalMinutesPM;
    const eightHoursMinutes = 8 * 60;

    const dayTag = getEffectiveDayTag({
      tagging: data.tagging,
      tagAM: session === 'AM' ? cleanTag : data.tagAM,
      tagPM: session === 'PM' ? cleanTag : data.tagPM,
    });

    let normalCountMinutes = 0;
    let overtimeMinutes = 0;

    if (dayTag === 'Overtime') {
      if (totalMinutes > eightHoursMinutes) {
        overtimeMinutes = totalMinutes - eightHoursMinutes;
      }
    } else {
      normalCountMinutes = Math.min(totalMinutes, eightHoursMinutes);
    }

    updatePayload.normalCountMinutes = normalCountMinutes;
    updatePayload.overtimeMinutes = overtimeMinutes;

    await attendanceRef.set(updatePayload, { merge: true });

    return res.json({
      message: 'Session retagged successfully',
      updated: true,
      date: dateString,
      session,
      tag: cleanTag,
      normalCountMinutes,
      overtimeMinutes,
    });
  } catch (err) {
    console.error('Admin retag-session error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Update basic user info (school, phone, email, etc.)
app.put('/users/:id/info', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const {
      schoolOrUniversity,
      phoneNumber,
      email,
      requiredHours,
      ojtRequiredHours,
      // New fields from profile redesign
      address,
      gender,
      dateOfBirth,
      course,
      yearLevel,
      startDate,
      endDate,
      department,
      assignedSupervisor,
      workSchedule,
      workDays,

    } = req.body;

    const userRef = db.collection('users').doc(id);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatePayload = {};
    if (typeof schoolOrUniversity === 'string') updatePayload.schoolOrUniversity = schoolOrUniversity;
    if (typeof phoneNumber === 'string') updatePayload.phoneNumber = phoneNumber;
    if (typeof email === 'string') updatePayload.email = email;
    if (requiredHours !== undefined) {
      const parsedRequired = Number(requiredHours);
      if (Number.isFinite(parsedRequired) && parsedRequired > 0) {
        updatePayload.requiredHours = parsedRequired;
      }
    }
    if (ojtRequiredHours !== undefined) {
      const parsedOjt = Number(ojtRequiredHours);
      if (Number.isFinite(parsedOjt) && parsedOjt > 0) {
        updatePayload.ojtRequiredHours = parsedOjt;
      }
    }

    // Assigning new fields to payload
    if (typeof address === 'string') updatePayload.address = address;
    if (typeof gender === 'string') updatePayload.gender = gender;
    if (typeof dateOfBirth === 'string') updatePayload.dateOfBirth = dateOfBirth;
    if (typeof course === 'string') updatePayload.course = course;
    if (typeof yearLevel === 'string') updatePayload.yearLevel = yearLevel;
    if (typeof startDate === 'string') updatePayload.startDate = startDate;
    if (typeof endDate === 'string') updatePayload.endDate = endDate;
    if (typeof department === 'string') updatePayload.department = department;
    if (typeof assignedSupervisor === 'string') updatePayload.assignedSupervisor = assignedSupervisor;
    if (typeof workSchedule === 'string') updatePayload.workSchedule = workSchedule;
    if (typeof workDays === 'string') updatePayload.workDays = workDays;


    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: 'No updatable fields provided' });
    }

    updatePayload.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await userRef.update(updatePayload);

    const updatedSnap = await userRef.get();
    const updatedUser = { id: updatedSnap.id, ...updatedSnap.data() };

    // Create a notification that profile info was updated
    await createUserNotification(id, {
      title: 'Profile Updated',
      message: 'Your profile information was updated.',
      type: 'profile_update',
      metadata: {
        updatedFields: Object.keys(updatePayload),
      },
    });

    return res.json({
      message: 'User info updated',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update user info error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Change user password with current password verification
app.post('/users/:id/change-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const userRef = db.collection('users').doc(id);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = snap.data();
    // Verify current hashed password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password || '');
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await userRef.update({
      password: hashedNewPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create a notification that password was changed
    await createUserNotification(id, {
      title: 'Password Changed',
      message: 'Your account password was changed.',
      type: 'password_change',
      metadata: {},
    });

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch today's attendance record for an intern
app.get('/attendance/intern/today', async (req, res) => {
  try {
    const { internId } = req.query;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const { dateString } = getTodayInfo();
    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('intern_attendance').doc(docId);

    const snapshot = await attendanceRef.get();

    if (!snapshot.exists) {
      return res.json({
        message: 'No attendance record for today',
        data: null,
      });
    }

    const data = snapshot.data();

    const responseRecord = {
      internId: data.internId,
      date: data.date,
      timeInAM: data.timeInAM || null,
      timeOutAM: data.timeOutAM || null,
      timeInPM: data.timeInPM || null,
      timeOutPM: data.timeOutPM || null,
      totalMinutesAM: data.totalMinutesAM ?? null,
      totalMinutesPM: data.totalMinutesPM ?? null,
      totalMinutes: data.totalMinutes ?? null,
      normalCountMinutes: data.normalCountMinutes ?? null,
      overtimeMinutes: data.overtimeMinutes ?? null,
      tagging: data.tagging || null,
      tagAM: data.tagAM || null,
      tagPM: data.tagPM || null,
      locationAM: data.locationAM || null,
      locationPM: data.locationPM || null,
      validationStatusAM: data.validationStatusAM || null,
      rejectReasonAM: data.rejectReasonAM || null,
      validationStatusPM: data.validationStatusPM || null,
      rejectReasonPM: data.rejectReasonPM || null,

      isLocked: !!data.isLocked,
    };

    return res.json({
      message: 'Attendance for today',
      data: responseRecord,
    });
  } catch (err) {
    console.error('Fetch today attendance error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch full attendance history for an intern
app.get('/attendance/intern/history', async (req, res) => {
  try {
    const { internId } = req.query;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const snap = await db
      .collection('intern_attendance')

      .where('internId', '==', internId)
      .get();

    if (snap.empty) {
      return res.json({
        message: 'No attendance records found',
        data: [],
      });
    }

    const records = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const da = a.date || '';
        const dbDate = b.date || '';
        if (da < dbDate) return -1;
        if (da > dbDate) return 1;
        return 0;
      });

    return res.json({
      message: 'Attendance history fetched',
      data: records,
    });
  } catch (err) {
    console.error('Fetch attendance history error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * NEW: RFID Scan Endpoint for ESP32 Hardware integration
 * Handles both identification and attendance recording.
 */
app.post('/api/rfid/scan', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }

    const { dateString, timeString, now } = getTodayInfo();

    // --- NEW: Registration Mode Logic ---
    if (rfidRegisterMode) {
      const targetUserId = rfidRegisterMode;
      
      // Check if this card is already registered to someone else
      const existingQuery = await db.collection('users').where('rfid', '==', uid).limit(1).get();
      if (!existingQuery.empty) {
        const existingUser = existingQuery.docs[0];
        if (existingUser.id !== targetUserId) {
          const userData = existingUser.data();
          const existingName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'User';
          return res.json({
            status: 'error',
            message: 'ALREADY USED',
            name: existingName
          });
        }
      }

      const userRef = db.collection('users').doc(targetUserId);
      const userSnap = await userRef.get();
      
      if (userSnap.exists) {
        const userData = userSnap.data();
        const userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'User';
        
        await userRef.update({
          rfid: uid,
          rfidUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Update system doc to notify frontend
        try {
          await db.collection('system').doc('rfid_scanner').set({
            lastScannedUID: uid,
            status: 'registered',
            userName: userName,
            scannedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (e) {
          console.error('Failed to update rfid_scanner for registration success:', e);
        }
        
        // Clear mode after successful registration
        const registeredFor = rfidRegisterMode;
        rfidRegisterMode = null;
        
        console.log(`RFID: Automatically registered UID ${uid} for user ${registeredFor}`);
        
        return res.json({
          status: 'success',
          message: 'REGISTERED',
          name: userName,
          role: 'Success',
          time: timeString
        });
      }
    }
    // --- End Registration Mode Logic ---

    const usersRef = db.collection('users');
    const q = usersRef.where('rfid', '==', uid).limit(1);
    const snap = await q.get();

    if (snap.empty) {
      // Store the last scanned unknown UID for auto-fill in registration page
      try {
        await db.collection('system').doc('rfid_scanner').set({
          lastScannedUID: uid,
          scannedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (e) {
        console.error('Failed to update rfid_scanner system state:', e);
      }
      
      // Return 404 but with a helpful message for the hardware to display
      return res.status(404).json({
        status: 'error',
        message: 'Unknown Tag',
        uid: uid
      });
    }

    const userDoc = snap.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User';
    const role = user.role || 'unknown';

    // Simplified attendance logic for RFID terminal
    // Determine target collection
    const collectionName = (role === 'student' || role === 'intern') ? 'intern_attendance' : 'staff_attendance';
    const docId = `${userId}_${dateString}`;
    const attendanceRef = db.collection(collectionName).doc(docId);
    const attSnap = await attendanceRef.get();

    let action = 'Time In';
    let session = now.getHours() < 12 ? 'AM' : 'PM';

    if (!attSnap.exists) {
      // First time in for today
      const payload = {
        userId: userId,
        [role === 'staff' ? 'staffId' : 'internId']: userId,
        date: dateString,
        [`timeIn${session}`]: timeString,
        [`status${session}`]: 'Present',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await attendanceRef.set(payload);
    } else {
      const data = attSnap.data();
      // Logic for toggling Time In / Time Out
      // If timed in but not timed out for the current session, then time out
      if (data[`timeIn${session}`] && !data[`timeOut${session}`]) {
        action = 'Time Out';
        await attendanceRef.update({
          [`timeOut${session}`]: timeString,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else if (!data[`timeIn${session}`]) {
        // New session (e.g. was timed out for AM, now timing in for PM)
        action = 'Time In';
        await attendanceRef.update({
          [`timeIn${session}`]: timeString,
          [`status${session}`]: 'Present',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Already timed in and out for this session? Maybe allow re-entry or just show status
        return res.json({
          status: 'info',
          message: 'Already Recorded',
          name: userName,
          role: role,
          action: 'Done'
        });
      }
    }

    // Success response for ESP32
    return res.json({
      status: 'success',
      message: action,
      name: userName,
      role: role.charAt(0).toUpperCase() + role.slice(1),
      time: timeString
    });

  } catch (err) {
    console.error('RFID scan process error:', err);
    return res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

/**
 * NEW: Toggle Registration Mode
 * Tells the backend that the next RFID scan should be assigned to this userId.
 */
app.post('/api/rfid/register-mode', (req, res) => {
  const { userId, enable } = req.body;
  if (enable && userId) {
    rfidRegisterMode = userId;
    console.log(`RFID Register Mode: ON for user ${userId}`);
  } else {
    rfidRegisterMode = null;
    console.log(`RFID Register Mode: OFF`);
  }
  res.json({ success: true, mode: rfidRegisterMode });
});

/**
 * NEW: Manual Registration Endpoint
 * Performs a uniqueness check before assigning an RFID to a staff member.
 */
app.post('/api/rfid/register-manual', async (req, res) => {
  const { userId, uid } = req.body;

  if (!userId || !uid) {
    return res.status(400).json({ status: 'error', message: 'Missing userId or uid' });
  }

  try {
    // Check for duplicates
    const existingQuery = await db.collection('users').where('rfid', '==', uid).limit(1).get();
    if (!existingQuery.empty) {
      const existingUser = existingQuery.docs[0];
      if (existingUser.id !== userId) {
        const userData = existingUser.data();
        const existingName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'User';
        return res.status(400).json({ 
          status: 'error', 
          message: `This tag is already registered to ${existingName}` 
        });
      }
    }

    // Perform Update
    await db.collection('users').doc(userId).update({
      rfid: uid,
      rfidUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ status: 'success', message: 'RFID Registered' });
  } catch (err) {
    console.error('Manual RFID registration error:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


