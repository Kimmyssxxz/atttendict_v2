const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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

async function ensureDailyUserTaggingReset(userId, userData, dateString) {
  try {
    if (!userId || !userData || !dateString) return { changed: false, userData };

    const lastReset = typeof userData.taggingLastResetDate === 'string' ? userData.taggingLastResetDate : '';
    if (lastReset === dateString) {
      return { changed: false, userData };
    }

    const updatePayload = {
      tagging: 'Normal Hours',
      todayAmTag: 'Normal Hours',
      todayPmTag: 'Normal Hours',
      taggingLastResetDate: dateString,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(userId).set(updatePayload, { merge: true });

    return {
      changed: true,
      userData: {
        ...userData,
        ...updatePayload,
      },
    };
  } catch (e) {
    console.error('Failed daily tagging reset for user', userId, e);
    return { changed: false, userData };
  }
}

// Derive the effective day tagging based on day-level and per-session tags.
// Priority:
// 1) Explicit day-level tagging field
// 2) If any session is tagged 'Overtime', treat the whole day as Overtime
// 3) Otherwise fall back to any non-empty session tag, or 'Normal Hours'
function getEffectiveDayTag(data) {
  if (!data) return 'Normal Hours';

  const dayTag = (data.tagging && typeof data.tagging === 'string' && data.tagging.trim()) || '';
  if (dayTag) return dayTag.trim();

  const amTag = (data.tagAM && typeof data.tagAM === 'string' && data.tagAM.trim()) || '';
  const pmTag = (data.tagPM && typeof data.tagPM === 'string' && data.tagPM.trim()) || '';

  if (amTag === 'Overtime' || pmTag === 'Overtime') return 'Overtime';
  if (amTag) return amTag;
  if (pmTag) return pmTag;

  return 'Normal Hours';
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

    const { dateString } = getTodayInfo();

    const docRef = await db.collection('users').add({
      username,
      firstName,
      middleName,
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
        }
      } else {
        payload.timeInPM = timeString;
        payload.tagging = userTagging;
        // For PM session, prefer per-session default then fall back to day-level
        payload.tagPM = userTagPM || userTagging;
        if (location) {
          payload.locationPM = location;
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
        if (data.validationStatus !== 'Approved') return;

        const totalMinutesAM = typeof data.totalMinutesAM === 'number' ? data.totalMinutesAM : 0;
        const totalMinutesPM = typeof data.totalMinutesPM === 'number' ? data.totalMinutesPM : 0;

        const fourHoursMinutes = 4 * 60;

        const tagAM = (data.tagAM || data.tagging || 'Normal Hours').trim();
        const tagPM = (data.tagPM || data.tagging || 'Normal Hours').trim();

        let countedAM = 0;
        let countedPM = 0;

        if (data.timeInAM || data.timeOutAM) {
          if (tagAM === 'Overtime') {
            countedAM = Math.max(0, totalMinutesAM);
          } else {
            countedAM = Math.min(Math.max(0, totalMinutesAM), fourHoursMinutes);
          }
        }

        if (data.timeInPM || data.timeOutPM) {
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
