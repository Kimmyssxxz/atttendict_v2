import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  getDocs, 
  orderBy, 
  where, 
  doc, 
  getDoc, 
  deleteDoc 
} from 'firebase/firestore'
import { db } from '@/firebase'

// ==================== LOGBOOK OPERATIONS ====================

// CREATE operations
export async function createClientLogbookEntry(payload) {
  const entriesRef = collection(db, 'client_logbook')

  const services = Array.isArray(payload.serviceAvailed)
    ? payload.serviceAvailed
    : (payload.serviceAvailed ? [payload.serviceAvailed] : [])

  const docPayload = {
    fullName: payload.fullName,
    age: payload.age,
    gender: payload.gender,
    address: payload.address,
    city: payload.city,
    barangay: payload.barangay,
    sector: payload.sector || '',
    contactNumber: payload.contactNumber,
    emailAddress: payload.emailAddress,
    serviceAvailed: services[0] || '',
    servicesAvailed: services,
    dataPrivacyConsent: payload.dataPrivacyConsent,
    agreementConfirmed: payload.agreementConfirmed === true,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(entriesRef, docPayload)
  return docRef.id
}

// READ operations
export async function getClientLogbookEntries() {
  try {
    const entriesRef = collection(db, 'client_logbook')
    const q = query(entriesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const entries = []
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return entries
  } catch (error) {
    console.error('Error fetching client logbook entries:', error)
    return []
  }
}

export async function getClientLogbookEntriesByDateRange(startDate, endDate) {
  try {
    const entriesRef = collection(db, 'client_logbook')
    const q = query(
      entriesRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const entries = []
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return entries
  } catch (error) {
    console.error('Error fetching client logbook entries by date range:', error)
    return []
  }
}

export async function getClientLogbookEntryById(id) {
  if (!id) return null

  const docRef = doc(db, 'client_logbook', id)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

// DELETE operations
export async function deleteClientLogbookEntry(id) {
  try {
    await deleteDoc(doc(db, 'client_logbook', id))
    return true
  } catch (error) {
    console.error('Error deleting client logbook entry:', error)
    return false
  }
}

// ==================== DTC TRAINING EVALUATION OPERATIONS ====================

// CREATE operations
export const createDtcTrainingEvaluation = async (evaluationData) => {
  try {
    const docRef = await addDoc(collection(db, 'dtc_training_evaluations'), {
      ...evaluationData,
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating DTC training evaluation:', error)
    throw new Error('Failed to save DTC training evaluation')
  }
}

// READ operations
export const getDtcTrainingEvaluations = async () => {
  try {
    const evaluationsRef = collection(db, 'dtc_training_evaluations')
    const q = query(evaluationsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const evaluations = []
    querySnapshot.forEach((doc) => {
      evaluations.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return evaluations
  } catch (error) {
    console.error('Error fetching DTC training evaluations:', error)
    return []
  }
}

export const getDtcTrainingEvaluationById = async (id) => {
  try {
    const docRef = doc(db, 'dtc_training_evaluations', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: doc.id,
        ...doc.data()
      }
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching DTC training evaluation by ID:', error)
    return null
  }
}

export const getDtcTrainingEvaluationsByDateRange = async (startDate, endDate) => {
  try {
    const evaluationsRef = collection(db, 'dtc_training_evaluations')
    const q = query(
      evaluationsRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const evaluations = []
    querySnapshot.forEach((doc) => {
      evaluations.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return evaluations
  } catch (error) {
    console.error('Error fetching DTC training evaluations by date range:', error)
    return []
  }
}

// DELETE operations
export const deleteDtcTrainingEvaluation = async (id) => {
  try {
    await deleteDoc(doc(db, 'dtc_training_evaluations', id))
    return true
  } catch (error) {
    console.error('Error deleting DTC training evaluation:', error)
    return false
  }
}

// ==================== UTILITY FUNCTIONS ====================

export const getClientStats = async () => {
  try {
    const [logbookEntries, dtcEvaluations] = await Promise.all([
      getClientLogbookEntries(),
      getDtcTrainingEvaluations()
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thisWeek = new Date()
    thisWeek.setDate(today.getDate() - today.getDay())
    thisWeek.setHours(0, 0, 0, 0)

    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    return {
      totalLogbookEntries: logbookEntries.length,
      totalDtcEvaluations: dtcEvaluations.length,
      todayLogbookEntries: logbookEntries.filter(entry => {
        const entryDate = entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt)
        return entryDate >= today
      }).length,
      todayDtcEvaluations: dtcEvaluations.filter(evaluation => {
        const evalDate = evaluation.createdAt.toDate ? evaluation.createdAt.toDate() : new Date(evaluation.createdAt)
        return evalDate >= today
      }).length,
      thisWeekLogbookEntries: logbookEntries.filter(entry => {
        const entryDate = entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt)
        return entryDate >= thisWeek
      }).length,
      thisWeekDtcEvaluations: dtcEvaluations.filter(evaluation => {
        const evalDate = evaluation.createdAt.toDate ? evaluation.createdAt.toDate() : new Date(evaluation.createdAt)
        return evalDate >= thisWeek
      }).length,
      thisMonthLogbookEntries: logbookEntries.filter(entry => {
        const entryDate = entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt)
        return entryDate >= thisMonth
      }).length,
      thisMonthDtcEvaluations: dtcEvaluations.filter(evaluation => {
        const evalDate = evaluation.createdAt.toDate ? evaluation.createdAt.toDate() : new Date(evaluation.createdAt)
        return evalDate >= thisMonth
      }).length
    }
  } catch (error) {
    console.error('Error fetching client stats:', error)
    return {
      totalLogbookEntries: 0,
      totalDtcEvaluations: 0,
      todayLogbookEntries: 0,
      todayDtcEvaluations: 0,
      thisWeekLogbookEntries: 0,
      thisWeekDtcEvaluations: 0,
      thisMonthLogbookEntries: 0,
      thisMonthDtcEvaluations: 0
    }
  }
}
