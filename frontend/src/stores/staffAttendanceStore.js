import { defineStore } from 'pinia'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  GeoPoint,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove,
  setDoc
} from 'firebase/firestore'
import { 
  ref as storageRef, 
  uploadString, 
  getDownloadURL, 
  listAll, 
  getMetadata 
} from 'firebase/storage'
import { db, storage } from '../firebase'

import { API_BASE_URL } from '../config'
const GEO_API_BASE_URL = import.meta.env.DEV ? '' : API_BASE_URL

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getLocalTimeString = (d = new Date()) => d.toTimeString().slice(0, 8)

const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `${GEO_API_BASE_URL}/geo/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) {
      console.error('Error fetching address:', response.status);
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

const getRawLocation = (json) => {
  const addressFromObject = (obj) => {
    if (!obj || typeof obj !== 'object') return null
    const parts = [
      obj.house_number,
      obj.road || obj.street,
      obj.neighbourhood,
      obj.suburb || obj.village || obj.locality,
      obj.city_district || obj.district,
      obj.city || obj.town || obj.municipality,
      obj.state || obj.region,
      obj.postcode,
      obj.country
    ].filter(Boolean)

    const uniqueParts = [...new Set(parts)]
    return uniqueParts.length ? uniqueParts.join(', ') : null
  }

  const addressLine = (
    (typeof json?.display_name === 'string' && json.display_name.trim() !== '' ? json.display_name : null) ||
    addressFromObject(json?.address) ||
    addressFromObject(json?.raw?.address) ||
    addressFromObject(json?.raw?.properties) ||
    (typeof json?.raw?.display_name === 'string' ? json.raw.display_name : null) ||
    (typeof json?.address === 'string' ? json.address : null) ||
    (typeof json?.addressLine === 'string' ? json.addressLine : null) ||
    null
  )

  return typeof addressLine === 'string' ? addressLine.trim() : null
}

export const useStaffAttendanceStore = defineStore('staffAttendance', {
  state: () => ({
    staffAttendances: [],
    loading: false,
    error: null,
    currentStaffAttendance: null,
    resolvedStaffId: null,
    pagination: {
      currentPage: 1,
      pageSize: 20,
      totalDocs: 0,
      lastVisible: null
    },
    staffUsers: []
  }),

  getters: {
    // Get all staff attendances
    getAllStaffAttendances: (state) => state.staffAttendances,

    currentStaffId: () => {
      try {
        const raw = localStorage.getItem('staffUser')
        const u = raw ? JSON.parse(raw) : null
        return u?.id || u?.staffId || u?._id || null
      } catch {
        return null
      }
    },

    // Get current staff attendance
    getCurrentStaffAttendance: (state) => state.currentStaffAttendance,

    // Get loading state
    isLoading: (state) => state.loading,

    // Get error state
    getError: (state) => state.error,

    // Get staff attendance by staff ID
    getStaffAttendanceByStaffId: (state) => (staffId) => {
      return state.staffAttendances.filter(attendance => attendance.staffId === staffId)
    },

    // Get staff attendance by date
    getStaffAttendanceByDate: (state) => (date) => {
      return state.staffAttendances.filter(attendance => attendance.date === date)
    },

    // Get staff attendance by date range
    getStaffAttendanceByDateRange: (state) => (startDate, endDate) => {
      return state.staffAttendances.filter(attendance => {
        const attendanceDate = new Date(attendance.date)
        return attendanceDate >= new Date(startDate) && attendanceDate <= new Date(endDate)
      })
    },

    // Get locked attendances
    getLockedAttendances: (state) => {
      return state.staffAttendances.filter(attendance => attendance.isLocked)
    },

    // Get unlocked attendances
    getUnlockedAttendances: (state) => {
      return state.staffAttendances.filter(attendance => !attendance.isLocked)
    },

    // Get attendance statistics
    getAttendanceStats: (state) => {
      const total = state.staffAttendances.length
      const locked = state.staffAttendances.filter(a => a.isLocked).length
      const withTimeInAM = state.staffAttendances.filter(a => a.timeInAM).length
      const withTimeOutAM = state.staffAttendances.filter(a => a.timeOutAM).length
      const withTimeInPM = state.staffAttendances.filter(a => a.timeInPM).length
      const withTimeOutPM = state.staffAttendances.filter(a => a.timeOutPM).length

      return {
        total,
        locked,
        unlocked: total - locked,
        timeInAMRate: total > 0 ? (withTimeInAM / total) * 100 : 0,
        timeOutAMRate: total > 0 ? (withTimeOutAM / total) * 100 : 0,
        timeInPMRate: total > 0 ? (withTimeInPM / total) * 100 : 0,
        timeOutPMRate: total > 0 ? (withTimeOutPM / total) * 100 : 0
      }
    }
  },

  actions: {
    async ensureCurrentStaffId() {
      const existing = this.currentStaffId || this.resolvedStaffId
      if (existing) return existing

      let staffUser = null
      try {
        const raw = localStorage.getItem('staffUser')
        staffUser = raw ? JSON.parse(raw) : null
      } catch {
        staffUser = null
      }

      const username = String(staffUser?.username || '').trim()
      const email = String(staffUser?.email || '').trim()

      if (!username && !email) return null

      try {
        let userSnap = null
        if (username) {
          const q = query(collection(db, 'users'), where('username', '==', username), limit(1))
          userSnap = await getDocs(q)
        }

        if ((!userSnap || userSnap.empty) && email) {
          const q = query(collection(db, 'users'), where('email', '==', email), limit(1))
          userSnap = await getDocs(q)
        }

        if (!userSnap || userSnap.empty) return null

        const docSnap = userSnap.docs[0]
        const userData = docSnap.data() || {}

        if (String(userData.role || '').toLowerCase() !== 'staff') return null

        const staffId = docSnap.id
        this.resolvedStaffId = staffId

        try {
          const next = { ...(staffUser || {}), id: staffId }
          localStorage.setItem('staffUser', JSON.stringify(next))
        } catch {
          // ignore
        }

        return staffId
      } catch {
        return null
      }
    },

    resolveStaffId(staffId) {
      return staffId || this.currentStaffId || this.resolvedStaffId || null
    },

    async reverseGeocodeOSM(latitude, longitude) {
      try {
        if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) return null

        const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude)
        const lon = typeof longitude === 'number' ? longitude : parseFloat(longitude)
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

        const data = await getAddressFromCoordinates(lat, lon)
        const addressLine = getRawLocation(data)
        return addressLine || null
      } catch (e) {
        return null
      }
    },

    sanitizeUpdateData(updateData, options = {}) {
      const sanitized = {}
      const allowNullKeys = Array.isArray(options?.allowNullKeys) ? options.allowNullKeys : []

      Object.entries(updateData || {}).forEach(([key, value]) => {
        if (value === undefined) return
        if (value === null && !allowNullKeys.includes(key)) return

        if (typeof value === 'string') {
          const trimmed = value.trim()
          if (trimmed === '') return
          sanitized[key] = trimmed
          return
        }

        const isLatLngKey = typeof key === 'string' && (/latitude/i.test(key) || /longitude/i.test(key))
        if (isLatLngKey && typeof value === 'number') {
          if (Number.isNaN(value)) return
          sanitized[key] = value
          return
        }

        sanitized[key] = value
      })

      return sanitized
    },

    normalizeNumber(value) {
      if (value === null || value === undefined) return null

      let num = null
      if (typeof value === 'number') num = value
      else if (typeof value === 'string') {
        const parsed = parseFloat(value)
        num = Number.isNaN(parsed) ? null : parsed
      } else {
        return null
      }

      if (num === null) return null
      if (!Number.isFinite(num)) return null
      return num
    },

    buildSessionLocationUpdate(session, locationData) {
      // Accept either {latitude, longitude} or {lat, lng}; always validate range
      const latitudeRaw = this.normalizeNumber(locationData?.latitude ?? locationData?.lat)
      const longitudeRaw = this.normalizeNumber(locationData?.longitude ?? locationData?.lng)

      const latitude = (latitudeRaw !== null && latitudeRaw >= -90 && latitudeRaw <= 90) ? latitudeRaw : null
      const longitude = (longitudeRaw !== null && longitudeRaw >= -180 && longitudeRaw <= 180) ? longitudeRaw : null
      const hasLatLng = latitude !== null && longitude !== null

      const update = {}

      if (locationData?.staffStatus) {
        update[`staffStatus${session}`] = locationData.staffStatus
      }

      // Build nested Loc object for the session
      const locObj = {}

      const address = typeof locationData?.address === 'string' ? locationData.address.trim() : null
      if (address) {
        locObj.address = address
      }
      if (latitude !== null) {
        locObj.latitude = latitude
      }
      if (longitude !== null) {
        locObj.longitude = longitude
      }
      if (hasLatLng) {
        locObj[`geo${session}`] = new GeoPoint(latitude, longitude)
      }

      if (Object.keys(locObj).length > 0) {
        update[`Loc${session}`] = locObj
      }

      return update
    },

    // Clear error state
    clearError() {
      this.error = null
    },

    // Upload photo to Firebase Storage
    async uploadPhoto(base64Data, filename) {
      if (!base64Data) return null
      try {
        const photoRef = storageRef(storage, `attendance_photos/${filename}`)
        await uploadString(photoRef, base64Data, 'data_url')
        const downloadUrl = await getDownloadURL(photoRef)
        return downloadUrl
      } catch (error) {
        console.error('Error uploading photo:', error)
        return null
      }
    },

    // Upload leave document to Firebase Storage
    async uploadLeaveDocument(base64Data, filename) {
      if (!base64Data) return null
      try {
        const fileRef = storageRef(storage, `leave_documents/${filename}`)
        await uploadString(fileRef, base64Data, 'data_url')
        const downloadUrl = await getDownloadURL(fileRef)
        return downloadUrl
      } catch (error) {
        console.error('Error uploading leave document:', error)
        return null
      }
    },

    // Update leave status, document URL, and duration
    async updateLeaveStatus(attendanceId, leaveDocumentUrls, leaveStartDate, leaveEndDate) {
      try {
        this.loading = true
        this.error = null

        const docRef = doc(db, 'staff_attendance', attendanceId)
        
        // Ensure leaveDocumentUrls is an array for internal consistency if needed, 
        // but we'll store what we get. If it's a single string, we'll handle it.
        const urls = Array.isArray(leaveDocumentUrls) ? leaveDocumentUrls : (leaveDocumentUrls ? [leaveDocumentUrls] : [])
        
        const updateData = {
          staffStatus: 'Leave',
          leaveDocumentUrls: urls,
          // Maintain legacy leaveDocumentUrl (singular) for backward compatibility with first item
          leaveDocumentUrl: urls.length > 0 ? urls[0] : null,
          leaveStartDate: leaveStartDate || null,
          leaveEndDate: leaveEndDate || null,
          validationStatus: 'Pending', // Explicitly set to Pending on submission
          updatedAt: serverTimestamp()
        }

        // Clean updateData to avoid undefined values
        Object.keys(updateData).forEach(key => {
          if (updateData[key] === undefined) delete updateData[key]
        })

        await updateDoc(docRef, updateData)

        // Update local state
        const index = this.staffAttendances.findIndex(att => att.id === attendanceId)
        if (index !== -1) {
          this.staffAttendances[index] = {
            ...this.staffAttendances[index],
            ...updateData
          }
        }

        if (this.currentStaffAttendance && this.currentStaffAttendance.id === attendanceId) {
          this.currentStaffAttendance = {
            ...this.currentStaffAttendance,
            ...updateData
          }
        }

        // Refresh all leave requests to ensure admin-level consistency
        await this.fetchLeaveRequests()

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error updating leave status:', error)
        return { success: false, error: error.message }
      }
    },

    // Create new staff attendance
    async createStaffAttendance(attendanceData) {
      try {
        this.loading = true
        this.error = null

        const docData = {
          staffId: this.resolveStaffId(attendanceData?.staffId),
          date: attendanceData.date,
          isLocked: attendanceData.isLocked || false,
          staffStatusAM: attendanceData.staffStatusAM || null,
          staffStatusPM: attendanceData.staffStatusPM || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        const optionalFields = this.sanitizeUpdateData({
          locationAM: attendanceData.locationAM,
          locationPM: attendanceData.locationPM,
          staffStatus: attendanceData.staffStatus,
          addressAM: attendanceData.addressAM,
          addressPM: attendanceData.addressPM,
          LocAM: attendanceData.LocAM,
          LocPM: attendanceData.LocPM,
          address: attendanceData.address,
          latitude: attendanceData.latitude,
          longitude: attendanceData.longitude,
          photoUrl: attendanceData.photoUrl
        })

        Object.assign(docData, optionalFields)

        const docId = `${docData.staffId}_${docData.date}`
        const docRef = doc(db, 'staff_attendance', docId)
        await setDoc(docRef, docData)

        const newAttendance = { id: docRef.id, ...docData }

        this.staffAttendances.push(newAttendance)
        this.loading = false

        return { success: true, data: newAttendance }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error creating staff attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // Update staff attendance
    async updateStaffAttendance(attendanceId, updateData, options = {}) {
      try {
        this.loading = true
        this.error = null

        const docRef = doc(db, 'staff_attendance', attendanceId)
        const docData = {
          ...this.sanitizeUpdateData(updateData, options),
          updatedAt: serverTimestamp()
        }

        await updateDoc(docRef, docData)

        // Update local state
        const index = this.staffAttendances.findIndex(att => att.id === attendanceId)
        if (index !== -1) {
          this.staffAttendances[index] = {
            ...this.staffAttendances[index],
            ...docData,
            id: attendanceId
          }
        }

        if (this.currentStaffAttendance && this.currentStaffAttendance.id === attendanceId) {
          this.currentStaffAttendance = {
            ...this.currentStaffAttendance,
            ...docData
          }
        }

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error updating staff attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // Delete staff attendance
    async deleteStaffAttendance(attendanceId) {
      try {
        this.loading = true
        this.error = null

        await deleteDoc(doc(db, 'staff_attendance', attendanceId))

        // Remove from local state
        this.staffAttendances = this.staffAttendances.filter(att => att.id !== attendanceId)

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error deleting staff attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // Archive staff attendance
    async archiveStaffAttendance(attendanceId) {
      try {
        this.loading = true
        this.error = null

        const docRef = doc(db, 'staff_attendance', attendanceId)
        await updateDoc(docRef, {
          isArchived: true,
          updatedAt: serverTimestamp()
        })

        // Remove from local state so it immediately disappears
        this.staffAttendances = this.staffAttendances.filter(att => att.id !== attendanceId)

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error archiving staff attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // Get single staff attendance by ID
    async getStaffAttendanceById(attendanceId) {
      try {
        this.loading = true
        this.error = null

        const docRef = doc(db, 'staff_attendance', attendanceId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const attendance = { id: docSnap.id, ...docSnap.data() }
          this.currentStaffAttendance = attendance
          this.loading = false
          return { success: true, data: attendance }
        } else {
          this.loading = false
          return { success: false, error: 'Staff attendance not found' }
        }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error getting staff attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // Get all staff attendances
    async fetchAllStaffAttendances() {
      try {
        this.loading = true
        this.error = null

        const q = query(
          collection(db, 'staff_attendance'),
          orderBy('createdAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const attendances = []

        querySnapshot.forEach((doc) => {
          attendances.push({ id: doc.id, ...doc.data() })
        })

        this.staffAttendances = attendances
        this.loading = false
        return { success: true, data: attendances }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error getting all staff attendances:', error)
        return { success: false, error: error.message }
      }
    },

    // Get staff attendances by staff ID
    async getStaffAttendancesByStaffId(staffId, limitCount = 50) {
      try {
        this.loading = true
        this.error = null

        const resolvedStaffId = this.resolveStaffId(staffId)
        if (!resolvedStaffId) {
          this.loading = false
          return { success: false, error: 'Missing staffId' }
        }

        // 1. Fetch recent attendances with limit
        const qRecent = query(
          collection(db, 'staff_attendance'),
          where('staffId', '==', resolvedStaffId),
          orderBy('date', 'desc'),
          limit(limitCount)
        )

        // 2. Fetch ALL leave requests for this staff
        const qLeave = query(
          collection(db, 'staff_attendance'),
          where('staffId', '==', resolvedStaffId),
          where('validationStatus', 'in', ['Pending', 'Approved', 'Rejected'])
        )

        const [snapRecent, snapLeave] = await Promise.all([
          getDocs(qRecent),
          getDocs(qLeave)
        ])

        const attendancesMap = new Map()
        snapRecent.forEach(doc => attendancesMap.set(doc.id, { id: doc.id, ...doc.data() }))
        snapLeave.forEach(doc => attendancesMap.set(doc.id, { id: doc.id, ...doc.data() }))

        const attendances = Array.from(attendancesMap.values())
        attendances.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())

        // Update only the attendances for this staff
        this.staffAttendances = [
          ...this.staffAttendances.filter(att => att.staffId !== resolvedStaffId),
          ...attendances
        ]

        this.loading = false
        return { success: true, data: attendances }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error getting staff attendances by staff ID:', error)
        return { success: false, error: error.message }
      }
    },

    // Get staff attendances by date range
    async getStaffAttendancesByDateRange(startDate, endDate, staffId = null) {
      try {
        this.loading = true
        this.error = null

        let q = query(
          collection(db, 'staff_attendance'),
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          orderBy('date', 'desc')
        )

        const resolvedStaffId = this.resolveStaffId(staffId)
        if (resolvedStaffId) {
          q = query(q, where('staffId', '==', resolvedStaffId))
        }

        const querySnapshot = await getDocs(q)
        const attendances = []

        querySnapshot.forEach((doc) => {
          attendances.push({ id: doc.id, ...doc.data() })
        })

        this.staffAttendances = attendances
        this.loading = false
        return { success: true, data: attendances }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error getting staff attendances by date range:', error)
        return { success: false, error: error.message }
      }
    },

    // Get staff attendances by date
    async getStaffAttendancesByDate(date) {
      try {
        this.loading = true
        this.error = null

        const q = query(
          collection(db, 'staff_attendance'),
          where('date', '==', date),
          orderBy('createdAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const attendances = []

        querySnapshot.forEach((doc) => {
          attendances.push({ id: doc.id, ...doc.data() })
        })

        this.staffAttendances = attendances
        this.loading = false
        return { success: true, data: attendances }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error getting staff attendances by date:', error)
        return { success: false, error: error.message }
      }
    },

    // Clock in AM - Enhanced with proper validation
    async clockInAM(attendanceId, locationData) {
      try {
        this.loading = true
        this.error = null

        if (!attendanceId) {
          this.loading = false
          return { success: false, error: 'Missing attendance record.' }
        }

        const docRef = doc(db, 'staff_attendance', attendanceId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
          this.loading = false
          return { success: false, error: 'Attendance record not found.' }
        }

        const current = snap.data()
        if (current?.isLocked) {
          this.loading = false
          return { success: false, error: 'Attendance is locked.' }
        }

        if (current?.timeInAM) {
          this.loading = false
          return { success: false, error: 'You already clocked in for AM.' }
        }

        // Build update data only with provided values, never null/empty
        const updateData = {
          timeInAM: getLocalTimeString(),
          timeOutAM: null,
          updatedAt: serverTimestamp()
        }

        if (locationData?.staffStatus) {
          updateData.staffStatus = locationData.staffStatus
        }

        const built = this.buildSessionLocationUpdate('AM', locationData)

        // Only explicitly set locAM address if it's missing but we DO have coords in locAM.
        const hasCoordsAM = built.LocAM?.latitude !== undefined && built.LocAM?.longitude !== undefined
        if (!built.LocAM?.address && hasCoordsAM) {
          const addr = await this.reverseGeocodeOSM(built.LocAM.latitude, built.LocAM.longitude)
          if (addr) {
            built.LocAM.address = addr
          }
        }

        // Upload photo if present and in travel/field mode
        if (locationData?.photoUrl && locationData.photoUrl.trim() !== '') {
          const filename = `photo_${attendanceId}_AM_${Date.now()}.jpg`
          const downloadUrl = await this.uploadPhoto(locationData.photoUrl.trim(), filename)
          if (downloadUrl) {
            built.photoUrl = downloadUrl
          }
        }

        Object.assign(updateData, built)

        return await this.updateStaffAttendance(attendanceId, updateData, { allowNullKeys: ['timeOutAM'] })
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error clocking in AM:', error)
        return { success: false, error: error.message }
      }
    },

    // Clock out AM
    async clockOutAM(attendanceId, locationData) {
      try {
        this.loading = true
        this.error = null

        if (!attendanceId) {
          this.loading = false
          return { success: false, error: 'Missing attendance record.' }
        }

        const docRef = doc(db, 'staff_attendance', attendanceId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
          this.loading = false
          return { success: false, error: 'Attendance record not found.' }
        }

        const current = snap.data()
        if (current?.isLocked) {
          this.loading = false
          return { success: false, error: 'Attendance is locked.' }
        }

        if (!current?.timeInAM) {
          this.loading = false
          return { success: false, error: 'You have not clocked in for AM yet.' }
        }

        if (current?.timeOutAM) {
          this.loading = false
          return { success: false, error: 'You already clocked out for AM.' }
        }

        const updateData = {
          timeOutAM: getLocalTimeString(),
          updatedAt: serverTimestamp()
        }

        if (locationData?.staffStatus) {
          updateData.staffStatus = locationData.staffStatus
          updateData.staffStatusOutAM = locationData.staffStatus
        }

        const timeOutLatitude = this.normalizeNumber(locationData?.latitude)
        const timeOutLongitude = this.normalizeNumber(locationData?.longitude)

        const extraLocation = this.sanitizeUpdateData({
          timeOutAddressAM: locationData?.address,
          timeOutLatitudeAM: timeOutLatitude,
          timeOutLongitudeAM: timeOutLongitude
        })

        if (timeOutLatitude !== null && timeOutLongitude !== null) {
          extraLocation.timeOutGeoAM = new GeoPoint(timeOutLatitude, timeOutLongitude)
        }

        if (locationData?.photoUrl && locationData.photoUrl.trim() !== '') {
          const filename = `photo_${attendanceId}_AM_OUT_${Date.now()}.jpg`
          const downloadUrl = await this.uploadPhoto(locationData.photoUrl.trim(), filename)
          if (downloadUrl) {
            extraLocation.photoOutUrlAM = downloadUrl
          }
        }

        Object.assign(updateData, extraLocation)

        return await this.updateStaffAttendance(attendanceId, updateData)
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error clocking out AM:', error)
        return { success: false, error: error.message }
      }
    },

    // Clock in PM - Enhanced with proper validation
    async clockInPM(attendanceId, locationData) {
      try {
        this.loading = true
        this.error = null

        if (!attendanceId) {
          this.loading = false
          return { success: false, error: 'Missing attendance record.' }
        }

        const docRef = doc(db, 'staff_attendance', attendanceId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
          this.loading = false
          return { success: false, error: 'Attendance record not found.' }
        }

        const current = snap.data()
        if (current?.isLocked) {
          this.loading = false
          return { success: false, error: 'Attendance is locked.' }
        }

        if (current?.timeInPM) {
          this.loading = false
          return { success: false, error: 'You already clocked in for PM.' }
        }

        // Build update data only with provided values, never null/empty
        const updateData = {
          timeInPM: getLocalTimeString(),
          timeOutPM: null,
          updatedAt: serverTimestamp()
        }

        if (locationData?.staffStatus) {
          updateData.staffStatus = locationData.staffStatus
        }

        const built = this.buildSessionLocationUpdate('PM', locationData)

        // Only explicitly set locPM address if it's missing but we DO have coords in locPM.
        const hasCoordsPM = built.LocPM?.latitude !== undefined && built.LocPM?.longitude !== undefined
        if (!built.LocPM?.address && hasCoordsPM) {
          const addr = await this.reverseGeocodeOSM(built.LocPM.latitude, built.LocPM.longitude)
          if (addr) {
            built.LocPM.address = addr
          }
        }

        // Upload photo if present and in travel/field mode
        if (locationData?.photoUrl && locationData.photoUrl.trim() !== '') {
          const filename = `photo_${attendanceId}_PM_${Date.now()}.jpg`
          const downloadUrl = await this.uploadPhoto(locationData.photoUrl.trim(), filename)
          if (downloadUrl) {
            built.photoUrl = downloadUrl // Update photoUrl in Firestore to the Storage link
          }
        }

        Object.assign(updateData, built)

        return await this.updateStaffAttendance(attendanceId, updateData, { allowNullKeys: ['timeOutPM'] })
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error clocking in PM:', error)
        return { success: false, error: error.message }
      }
    },

    // Clock out PM
    async clockOutPM(attendanceId, locationData) {
      try {
        this.loading = true
        this.error = null

        if (!attendanceId) {
          this.loading = false
          return { success: false, error: 'Missing attendance record.' }
        }

        const docRef = doc(db, 'staff_attendance', attendanceId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
          this.loading = false
          return { success: false, error: 'Attendance record not found.' }
        }

        const current = snap.data()
        if (current?.isLocked) {
          this.loading = false
          return { success: false, error: 'Attendance is locked.' }
        }

        if (!current?.timeInPM) {
          this.loading = false
          return { success: false, error: 'You have not clocked in for PM yet.' }
        }

        if (current?.timeOutPM) {
          this.loading = false
          return { success: false, error: 'You already clocked out for PM.' }
        }

        const updateData = {
          timeOutPM: getLocalTimeString(),
          updatedAt: serverTimestamp()
        }

        if (locationData?.staffStatus) {
          updateData.staffStatus = locationData.staffStatus
          updateData.staffStatusOutPM = locationData.staffStatus
        }

        const timeOutLatitude = this.normalizeNumber(locationData?.latitude)
        const timeOutLongitude = this.normalizeNumber(locationData?.longitude)

        const extraLocation = this.sanitizeUpdateData({
          timeOutAddressPM: locationData?.address,
          timeOutLatitudePM: timeOutLatitude,
          timeOutLongitudePM: timeOutLongitude
        })

        if (timeOutLatitude !== null && timeOutLongitude !== null) {
          extraLocation.timeOutGeoPM = new GeoPoint(timeOutLatitude, timeOutLongitude)
        }

        if (locationData?.photoUrl && locationData.photoUrl.trim() !== '') {
          const filename = `photo_${attendanceId}_PM_OUT_${Date.now()}.jpg`
          const downloadUrl = await this.uploadPhoto(locationData.photoUrl.trim(), filename)
          if (downloadUrl) {
            extraLocation.photoOutUrlPM = downloadUrl
          }
        }

        Object.assign(updateData, extraLocation)

        return await this.updateStaffAttendance(attendanceId, updateData)
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error clocking out PM:', error)
        return { success: false, error: error.message }
      }
    },

    // Lock/Unlock attendance
    async toggleLockAttendance(attendanceId, isLocked) {
      try {
        this.loading = true
        this.error = null

        const updateData = {
          isLocked,
          updatedAt: serverTimestamp()
        }

        return await this.updateStaffAttendance(attendanceId, updateData)
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error toggling lock:', error)
        return { success: false, error: error.message }
      }
    },

    // Bulk update attendances
    async bulkUpdateAttendances(updates) {
      try {
        this.loading = true
        this.error = null

        const batch = writeBatch(db)

        updates.forEach(({ id, data }) => {
          const docRef = doc(db, 'staff_attendance', id)
          batch.update(docRef, {
            ...data,
            updatedAt: serverTimestamp()
          })
        })

        await batch.commit()

        // Update local state
        updates.forEach(({ id, data }) => {
          const index = this.staffAttendances.findIndex(att => att.id === id)
          if (index !== -1) {
            this.staffAttendances[index] = {
              ...this.staffAttendances[index],
              ...data,
              id
            }
          }
        })

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error bulk updating attendances:', error)
        return { success: false, error: error.message }
      }
    },

    // Get today's attendance for staff
    async getTodayStaffAttendance(staffId) {
      try {
        this.loading = true
        this.error = null

        const resolvedStaffId = this.resolveStaffId(staffId)
        if (!resolvedStaffId) {
          this.loading = false
          return { success: false, error: 'Missing staffId' }
        }

        const today = getLocalDateString()

        const q = query(
          collection(db, 'staff_attendance'),
          where('staffId', '==', resolvedStaffId),
          where('date', '==', today)
        )

        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          const attendance = { id: doc.id, ...doc.data() }
          this.currentStaffAttendance = attendance
          this.loading = false
          return { success: true, data: attendance }
        } else {
          this.loading = false
          return { success: false, error: 'No attendance found for today' }
        }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error getting today staff attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // Create or get daily attendance
    async createOrGetDailyAttendance(staffId, date = null) {
      try {
        this.loading = true
        this.error = null

        const resolvedStaffId = this.resolveStaffId(staffId)
        if (!resolvedStaffId) {
          this.loading = false
          return { success: false, error: 'Missing staffId' }
        }

        const attendanceDate = date || getLocalDateString()

        // First check if attendance exists for this date
        const q = query(
          collection(db, 'staff_attendance'),
          where('staffId', '==', resolvedStaffId),
          where('date', '==', attendanceDate)
        )

        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          // Return existing attendance
          const doc = querySnapshot.docs[0]
          const attendance = { id: doc.id, ...doc.data() }
          this.currentStaffAttendance = attendance
          this.loading = false
          return { success: true, data: attendance, isNew: false }
        } else {
          // Create new attendance
          const attendanceData = {
            staffId: resolvedStaffId,
            date: attendanceDate,
            isLocked: false,
            staffStatusAM: null,
            staffStatusPM: null
          }

          const result = await this.createStaffAttendance(attendanceData)
          this.loading = false
          return { ...result, isNew: true }
        }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error creating or getting daily attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // Search attendances
    async searchAttendances(searchTerm, filters = {}) {
      try {
        this.loading = true
        this.error = null

        let q = query(collection(db, 'staff_attendance'))

        // Apply filters
        if (filters.staffId) {
          q = query(q, where('staffId', '==', filters.staffId))
        }

        if (filters.date) {
          q = query(q, where('date', '==', filters.date))
        }

        if (filters.startDate && filters.endDate) {
          q = query(q, where('date', '>=', filters.startDate))
          q = query(q, where('date', '<=', filters.endDate))
        }

        if (filters.isLocked !== undefined) {
          q = query(q, where('isLocked', '==', filters.isLocked))
        }

        q = query(q, orderBy('date', 'desc'))

        const querySnapshot = await getDocs(q)
        let attendances = []

        querySnapshot.forEach((doc) => {
          attendances.push({ id: doc.id, ...doc.data() })
        })

        // Apply text search (client-side)
        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase()
          attendances = attendances.filter(attendance =>
            attendance.staffId?.toLowerCase().includes(lowerSearchTerm) ||
            attendance.locationAM?.toLowerCase().includes(lowerSearchTerm) ||
            attendance.locationPM?.toLowerCase().includes(lowerSearchTerm) ||
            attendance.addressAM?.toLowerCase().includes(lowerSearchTerm) ||
            attendance.address?.toLowerCase().includes(lowerSearchTerm) ||
            attendance.photoUrl?.toLowerCase().includes(lowerSearchTerm) ||
            (attendance.latitude && attendance.latitude.toString().includes(lowerSearchTerm)) ||
            (attendance.longitude && attendance.longitude.toString().includes(lowerSearchTerm))
          )
        }

        this.staffAttendances = attendances
        this.loading = false
        return { success: true, data: attendances }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error searching attendances:', error)
        return { success: false, error: error.message }
      }
    },

    // Validate staff attendance
    async validateStaffAttendance(attendanceId, validationStatus, remarks = '') {
      try {
        this.loading = true
        this.error = null

        const docRef = doc(db, 'staff_attendance', attendanceId)
        const updateData = {
          validationStatus, // 'Pending', 'Approved', 'Rejected'
          remarks,
          validatedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        await updateDoc(docRef, updateData)

        // Update local state
        const index = this.staffAttendances.findIndex(att => att.id === attendanceId)
        if (index !== -1) {
          this.staffAttendances[index] = {
            ...this.staffAttendances[index],
            ...updateData
          }
        }

        if (this.currentStaffAttendance && this.currentStaffAttendance.id === attendanceId) {
          this.currentStaffAttendance = {
            ...this.currentStaffAttendance,
            ...updateData
          }
        }

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error validating attendance:', error)
        return { success: false, error: error.message }
      }
    },

    // --- Staff User Management Actions ---
    
    // Fetch all leave requests (staffStatus === 'Leave' or AM/PM variations)
    async fetchLeaveRequests() {
      try {
        this.loading = true
        this.error = null

        const collectionRef = collection(db, 'staff_attendance')
        
        // We perform 4 separate queries because Firestore doesn't support OR across different fields efficiently
        const q1 = query(collectionRef, where('staffStatus', '==', 'Leave'))
        const q2 = query(collectionRef, where('staffStatusAM', '==', 'Leave'))
        const q3 = query(collectionRef, where('staffStatusPM', '==', 'Leave'))
        const q4 = query(collectionRef, where('leaveStartDate', '!=', null)) // Capture any record with leave metadata

        const [snap1, snap2, snap3, snap4] = await Promise.all([
          getDocs(q1),
          getDocs(q2),
          getDocs(q3),
          getDocs(q4)
        ])

        const resultsMap = new Map()
        
        const addDocs = (snapshot) => {
          snapshot.forEach((doc) => {
            resultsMap.set(doc.id, { id: doc.id, ...doc.data() })
          })
        }

        addDocs(snap1)
        addDocs(snap2)
        addDocs(snap3)
        addDocs(snap4)

        const leaveRequests = Array.from(resultsMap.values())

        // Update local state by merging or replacing
        // We want to keep existing records that are NOT leave, and add/update these leave ones
        const leaveIds = new Set(leaveRequests.map(r => r.id))
        this.staffAttendances = [
          ...this.staffAttendances.filter(att => !leaveIds.has(att.id)),
          ...leaveRequests
        ]

        this.loading = false
        return { success: true, data: leaveRequests }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error fetching leave requests:', error)
        return { success: false, error: error.message }
      }
    },

    // List all leave documents directly from Firebase Storage
    async listAllLeaveDocuments() {
      try {
        this.loading = true
        const folderRef = storageRef(storage, 'leave_documents')
        const res = await listAll(folderRef)
        
        const files = await Promise.all(res.items.map(async (item) => {
          const url = await getDownloadURL(item)
          const metadata = await getMetadata(item)
          return {
            name: item.name,
            fullPath: item.fullPath,
            url,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated
          }
        }))

        this.loading = false
        return { success: true, data: files }
      } catch (error) {
        this.loading = false
        console.error('Error listing leave documents:', error)
        return { success: false, error: error.message }
      }
    },

    // Fetch all staff users
    async fetchStaffUsers() {
      try {
        this.loading = true
        this.error = null

        const usersRef = collection(db, 'users')
        const q = query(
          usersRef,
          where('role', '==', 'staff')
        )

        const querySnapshot = await getDocs(q)
        const users = []

        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() })
        })

        this.staffUsers = users
        this.loading = false
        return { success: true, data: users }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error fetching staff users:', error)
        return { success: false, error: error.message }
      }
    },

    // Add a new staff user
    async addStaffUser(userData) {
      try {
        this.loading = true
        this.error = null

        const response = await fetch(`${API_BASE_URL}/auth/staff/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to add staff member');
        }

        const data = await response.json();
        const userId = data.userId;

        const newUser = { id: userId, ...userData, role: 'staff' }
        this.staffUsers.push(newUser)

        this.loading = false
        return { success: true, data: newUser }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error adding staff user:', error)
        return { success: false, error: error.message }
      }
    },

    // Update a staff user
    async updateStaffUser(userId, userData) {
      try {
        this.loading = true
        this.error = null

        const userRef = doc(db, 'users', userId)
        const updateData = {
          ...userData,
          updatedAt: serverTimestamp()
        }

        await updateDoc(userRef, updateData)

        // Update local state
        const index = this.staffUsers.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.staffUsers[index] = {
            ...this.staffUsers[index],
            ...userData,
            id: userId
          }
        }

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error updating staff user:', error)
        return { success: false, error: error.message }
      }
    },

    // Delete a staff user
    async deleteStaffUser(userId) {
      try {
        this.loading = true
        this.error = null

        await deleteDoc(doc(db, 'users', userId))

        // Remove from local state
        this.staffUsers = this.staffUsers.filter(u => u.id !== userId)

        this.loading = false
        return { success: true }
      } catch (error) {
        this.loading = false
        this.error = error.message
        console.error('Error deleting staff user:', error)
        return { success: false, error: error.message }
      }
    },

    // Reset state
    resetState() {
      this.staffAttendances = []
      this.staffUsers = []
      this.currentStaffAttendance = null
      this.loading = false
      this.error = null
      this.pagination = {
        currentPage: 1,
        pageSize: 20,
        totalDocs: 0,
        lastVisible: null
      }
    }
  }
})
