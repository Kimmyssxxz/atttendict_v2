import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

// READ operations
export const getFormSettings = async (formType = 'clientEvaluation') => {
  try {
    const settingsRef = doc(db, 'formSettings', formType)
    const settingsSnap = await getDoc(settingsRef)
    
    if (settingsSnap.exists()) {
      return settingsSnap.data()
    }
    
    // Return empty settings by default
    return {}
  } catch (error) {
    console.error('Error fetching form settings:', error)
    return {}
  }
}

// REALTIME operations
export const subscribeToFormSettings = (formType = 'clientEvaluation', callback) => {
  const settingsRef = doc(db, 'formSettings', formType)
  
  const unsubscribe = onSnapshot(settingsRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data()
      callback(data)
    } else {
      callback(null)
    }
  }, (error) => {
    console.error('Error listening to form settings:', error)
    callback(null)
  })
  
  return unsubscribe
}

// UPDATE operations
export const updateFormSettings = async (settings, formType = 'clientEvaluation') => {
  try {
    const settingsRef = doc(db, 'formSettings', formType)
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: new Date()
    })
    return true
  } catch (error) {
    console.error('Error updating form settings:', error)
    return false
  }
}

export const updateServicesInSettings = async (services, formType = 'clientEvaluation') => {
  try {
    const settingsRef = doc(db, 'formSettings', formType)
    const settingsSnap = await getDoc(settingsRef)
    
    let currentSettings = {}
    if (settingsSnap.exists()) {
      currentSettings = settingsSnap.data()
    }
    
    // Update only the available services
    const updatedSettings = {
      ...currentSettings,
      availableServices: services.map(service => ({ text: service, isEditing: false })),
      updatedAt: new Date()
    }
    
    await setDoc(settingsRef, updatedSettings)
    return true
  } catch (error) {
    console.error('Error updating services in settings:', error)
    return false
  }
}
