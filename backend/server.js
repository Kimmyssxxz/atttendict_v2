const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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

app.use(cors());
app.use(express.json());

// Simple startup test to verify Firestore credentials and connectivity
(async () => {
  try {
    const testSnap = await db.collection('users').limit(1).get();
    console.log('Firestore startup test OK. Users docs found:', testSnap.size);
  } catch (e) {
    console.error('Firestore startup test FAILED:', e);
  }
})();

function getTodayInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  const timeString = now.toTimeString().slice(0, 8); // HH:MM:SS
  return { now, dateString, timeString };
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
    const snapshot = await usersRef
      .where('username', '==', username)
      .where('password', '==', password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

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

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('username', '==', username)
      .where('password', '==', password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (user.role !== 'student' && user.role !== 'staff') {
      return res.status(403).json({ message: 'Only intern and staff accounts may log in here.' });
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
    console.error('Unified login error:', err);
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
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const ta = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
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

    const docRef = await usersRef.add({
      username,
      firstName,
      middleName: middleName || '',
      lastName,
      email,
      schoolOrUniversity,
      assignedOffice,
      position,
      role: 'student',
      password,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: 'Intern registered successfully',
      userId: docRef.id,
    });
  } catch (err) {
    console.error('Intern register error:', err);
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

app.post('/attendance/intern/time-in', async (req, res) => {
  try {
    const { internId, location } = req.body;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const { now, dateString, timeString } = getTodayInfo();

    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('attendance').doc(docId);
    const snapshot = await attendanceRef.get();

    // Decide session purely from current clock time
    const hour = now.getHours();
    const minute = now.getMinutes();
    const session = hour < 12 ? 'AM' : 'PM';

    let payload;
    let existing = null;

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
        locationAM: session === 'AM' && location ? location : null,
        locationPM: session === 'PM' && location ? location : null,
        isLocked: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
    } else {
      payload = {
        ...existing,
        internId,
        date: dateString,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (session === 'AM') {
        payload.timeInAM = timeString;
        payload.statusAM = isLate ? 'Late' : 'Present';
        if (location) {
          payload.locationAM = location;
        }
      } else {
        payload.timeInPM = timeString;
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
      locationAM: payload.locationAM || null,
      locationPM: payload.locationPM || null,
      isLocked: !!payload.isLocked,
    };

    // Also write a notification for this time in (saved per user & role)
    await createUserNotification(internId, {
      title: 'Time In Recorded',
      message: `You timed in for ${session} at ${timeString} on ${dateString}.`,
      type: 'time_in',
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
    const attendanceRef = db.collection('attendance').doc(docId);
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
    updated.totalMinutes = totalMinutesAM + totalMinutesPM;

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
      statusAM: merged.statusAM || null,
      statusPM: merged.statusPM || null,
      locationAM: merged.locationAM || null,
      locationPM: merged.locationPM || null,
      isLocked: !!merged.isLocked,
    };

    // Also write a notification for this time out (saved per user & role)
    await createUserNotification(internId, {
      title: 'Time Out Recorded',
      message: `You timed out for ${session} at ${timeString} on ${dateString}.`,
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
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
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    await userRef.update({
      password: newPassword,
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
    const attendanceRef = db.collection('attendance').doc(docId);
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
      tagAM: data.tagAM || null,
      tagPM: data.tagPM || null,
      locationAM: data.locationAM || null,
      locationPM: data.locationPM || null,
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
      .collection('attendance')
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
