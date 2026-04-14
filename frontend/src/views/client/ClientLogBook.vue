<template>
  <div class="min-h-screen flex items-center justify-center bg-white-900 px-4 py-8">
    <div
      class="mx-auto w-full"
      style="max-width: 1340px; aspect-ratio: 5 / 3; height: min(800px, 100vh - 2rem);"
    >
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">NEW DICT ORMIN LOGBOOK</h1>
        <p class="text-sm text-gray-600">Department of Information and Communications Technology</p>
      </div>

      <!-- Main Form Card -->
      <div class="w-full h-full bg-white rounded-3xl shadow-xl p-8 overflow-auto">
        <form @submit.prevent="submitForm" class="space-y-6">
          
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
            />
            <p v-if="validationErrors.fullName" class="text-red-500 text-xs mt-1">{{ validationErrors.fullName }}</p>
          </div>

          <!-- Age and Gender Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                id="age"
                v-model="form.age"
                type="number"
                placeholder="Enter age"
                min="1"
                max="150"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
              />
              <p v-if="validationErrors.age" class="text-red-500 text-xs mt-1">{{ validationErrors.age }}</p>
            </div>

            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                v-model="form.gender"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">LGBTQIA+</option>
              </select>
              <p v-if="validationErrors.gender" class="text-red-500 text-xs mt-1">{{ validationErrors.gender }}</p>
            </div>
          </div>

          <!-- Mobile Number and Email Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="mobileNumber" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="mobileNumber"
                v-model="form.mobileNumber"
                type="tel"
                placeholder="+63 912 345 6789"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
              />
             
              <p v-if="validationErrors.mobileNumber" class="text-red-500 text-xs mt-1">{{ validationErrors.mobileNumber }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
              />
              <p v-if="validationErrors.email" class="text-red-500 text-xs mt-1">{{ validationErrors.email }}</p>
            </div>
          </div>

          <!-- City and Barangay Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                id="city"
                v-model="form.city"
                @change="form.barangay = ''"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
              >
                <option value="">Select city/municipality</option>
                <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
              </select>
              <p v-if="validationErrors.city" class="text-red-500 text-xs mt-1">{{ validationErrors.city }}</p>
            </div>

            <div>
              <label for="barangay" class="block text-sm font-medium text-gray-700 mb-2">
                Barangay
              </label>
              <select
                id="barangay"
                v-model="form.barangay"
                :disabled="!form.city"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
              >
                <option value="">Select barangay</option>
                <option v-for="barangay in availableBarangays" :key="barangay" :value="barangay">
                  {{ barangay }}
                </option>
              </select>
              <p v-if="validationErrors.barangay" class="text-red-500 text-xs mt-1">{{ validationErrors.barangay }}</p>
            </div>
          </div>

          <!-- Service Selection -->
          <div>
            <label for="service" class="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                v-for="opt in serviceOptions"
                :key="opt"
                class="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
              >
                <input
                  v-model="form.services"
                  type="checkbox"
                  class="h-4 w-4"
                  :value="opt"
                />
                <span class="text-sm text-gray-700">{{ opt }}</span>
              </label>
            </div>
            <p v-if="validationErrors.service" class="text-red-500 text-xs mt-1">{{ validationErrors.service }}</p>
          </div>

          <!-- Sector -->
          <div>
            <label for="sector" class="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <select
              id="sector"
              v-model="form.sector"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            >
              <option value="">Select sector</option>
              <option v-for="sect in availableSectors" :key="sect" :value="sect">{{ sect }}</option>
            </select>
            <p v-if="validationErrors.sector" class="text-red-500 text-xs mt-1">{{ validationErrors.sector }}</p>
          </div>

          <!-- Data Privacy -->
          <div class="flex items-start gap-3 pt-4">
            <input
              id="dataPrivacy"
              v-model="form.dataPrivacy"
              type="checkbox"
              class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer accent-blue-600"
            />
            <label for="dataPrivacy" class="text-sm text-gray-700 cursor-pointer">
              In compliance with the
              <button
                type="button"
                class="text-blue-600 font-semibold hover:underline"
                @click.stop="showDataPrivacyModal = true"
              >
                Data Privacy Act of 2012 (RA 10173)
              </button>
              by providing your personal information in this form, you voluntarily authorize DICT to collect, process, and store your data for official documentation, service monitoring, reporting, and related government transactions. All information collected will be treated with strict confidentiality and will only be used for legitimate purposes in connection with the services you availed. Your data will not be shared with unauthorized parties and will be protected in accordance with applicable data privacy and security regulations.
            </label>
          </div>
          <p v-if="validationErrors.dataPrivacy" class="text-red-500 text-xs mt-2">{{ validationErrors.dataPrivacy }}</p>

          <!-- Agreement Confirmation -->
          <div>
           
            <div class="flex flex-col sm:flex-row gap-3">
              <label class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                <input class="h-4 w-4" type="radio" name="agreement" value="yes" v-model="form.agreementConfirmation" />
                <span class="text-sm text-gray-700">I confirm that I have read, understood, and agreed to the Data Privacy Agreement stated above.</span>
              </label>
            </div>
            <p v-if="validationErrors.agreementConfirmation" class="text-red-500 text-xs mt-2">{{ validationErrors.agreementConfirmation }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-6">
            <button
              type="submit"
              :disabled="!isFormComplete || submitting"
              class="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mt-6 bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded"
        >
          <p class="font-semibold">✕ Submission failed</p>
          <p class="text-sm mt-1">{{ errorMessage }}</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="showSuccess"
          class="mt-6 bg-green-100 border-l-4 border-green-600 text-green-700 p-4 rounded"
        >
          <p class="font-semibold">✓ Information submitted successfully!</p>
        </div>
      </div>
    </div>

    <!-- Data Privacy Modal -->
    <Transition name="fade">
      <div v-if="showDataPrivacyModal" class="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto pointer-events-auto">
          <!-- Modal Header with Close Button -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0 flex items-center justify-between">
            <h3 class="text-2xl font-bold">Data Privacy Act of 2012 (RA 10173)</h3>
            <button
              @click="showDataPrivacyModal = false"
              class="text-white hover:bg-blue-800 rounded-lg p-1 transition"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->

          <div class="p-6 space-y-4 text-gray-700">
            <div class="text-sm leading-relaxed whitespace-pre-wrap">{{ dataPrivacyText }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Completion Modal -->
  <Transition name="fade" appear>
    <div v-if="showCompletionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <div class="text-center">
          <!-- Success Icon -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <!-- Success Message -->
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
          <p class="text-gray-600 mb-6">
            Your logbook entry has been successfully recorded. Your information has been saved and you can now proceed with your visit.
          </p>
          
          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
              @click="handleNewResponse"
              class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Another Response
            </button>
            <button
              @click="handleCloseModal"
              class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { createClientLogbookEntry } from '../../services/clientServices'
import { getFormSettings, updateServicesInSettings } from '../../services/clientFormSettings'
import { subscribeToFormSettings } from '../../services/clientFormSettings'

const form = ref({
  fullName: '',
  age: '',
  gender: '',
  mobileNumber: '',
  email: '',
  city: '',
  barangay: '',
  sector: '',
  services: [] as string[],
  dataPrivacy: false,
  agreementConfirmation: '' as '' | 'yes' | 'no',
})

const showDataPrivacyModal = ref(false)
const showSuccess = ref(false)
const showCompletionModal = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const validationErrors = ref<Record<string, string>>({})
const logbookId = ref('')

const router = useRouter()

const serviceOptions = ref([])

const availableCities = ref<string[]>([])
const availableSectors = ref<string[]>([])
const dataPrivacyText = ref<string>('')
const geographyData = ref<Record<string, string[]>>({})

const loadServices = async () => {
  try {
    const config = await getFormSettings('clientLogbook')
    
    if (config) {
      if (config.services && config.services.length > 0) {
        serviceOptions.value = config.services
      }
      if (config.sectors && config.sectors.length > 0) {
        availableSectors.value = config.sectors
      }
      if (config.geography) {
        geographyData.value = config.geography
        availableCities.value = Object.keys(config.geography).sort((a,b) => a.localeCompare(b))
      }
      if (config.dataPrivacyText) {
        dataPrivacyText.value = config.dataPrivacyText
      }
    }
  } catch (error) {
    console.error('Error loading configuration:', error)
  }
}

onMounted(() => {
  loadServices()
  
  // Set up real-time listener for configuration changes
  const unsubscribe = subscribeToFormSettings('clientLogbook', (data) => {
    if (data) {
      if (data.services) {
        serviceOptions.value = data.services
      }
      if (data.sectors) {
        availableSectors.value = data.sectors
      }
      if (data.geography) {
        geographyData.value = data.geography
        availableCities.value = Object.keys(data.geography).sort((a,b) => a.localeCompare(b))
      }
      if (data.dataPrivacyText) {
        dataPrivacyText.value = data.dataPrivacyText
      }
    }
  })
  
  // Store unsubscribe function for cleanup
  ;(window as any)._logbookConfigUnsubscribe = unsubscribe
})

onUnmounted(() => {
  // Clean up real-time listener
  if ((window as any)._logbookConfigUnsubscribe) {
    ;(window as any)._logbookConfigUnsubscribe()
  }
})

const availableBarangays = computed(() => {
  return geographyData.value[form.value.city] || []
})

const disposableDomains = ['mailinator.com', 'guerrillamail.com', 'yopmail.com', 'tempmail.net', 'temp-mail.org', '10minutemail.com', 'trashmail.com']

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) return false
  const domain = email.split('@')[1]?.toLowerCase()
  if (domain && disposableDomains.some(d => domain.includes(d))) return false
  return true
}

const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length === 11 || cleanPhone.length === 12
}

const validateForm = () => {
  validationErrors.value = {}

  if (!form.value.fullName.trim()) {
    validationErrors.value.fullName = 'Please indicate the correct spelling of your Full Name'
  }

  if (!form.value.age) {
    validationErrors.value.age = 'Age is required'
  } else if (Number(form.value.age) < 1 || Number(form.value.age) > 150) {
    validationErrors.value.age = 'Please enter a valid age'
  }

  if (!form.value.gender) {
    validationErrors.value.gender = 'Gender is required'
  }

  if (!form.value.mobileNumber.trim()) {
    validationErrors.value.mobileNumber = 'Phone number is required'
  } else if (!validatePhoneNumber(form.value.mobileNumber)) {
    validationErrors.value.mobileNumber = 'Enter a valid Philippine mobile number (11 digits)'
  }

  if (!form.value.email.trim()) {
    validationErrors.value.email = 'Email is required'
  } else if (!validateEmail(form.value.email)) {
    validationErrors.value.email = 'Enter a valid email address (disposable emails not allowed)'
  }

  if (!form.value.city) {
    validationErrors.value.city = 'City is required'
  }

  if (!form.value.barangay) {
    validationErrors.value.barangay = 'Barangay is required'
  }

  if (!form.value.sector) {
    validationErrors.value.sector = 'Sector is required'
  }

  if (!form.value.services || form.value.services.length === 0) {
    validationErrors.value.service = 'Please select at least one service'
  }

  if (!form.value.dataPrivacy) {
    validationErrors.value.dataPrivacy = 'You must agree to the Data Privacy Act to continue'
  }

  if (form.value.agreementConfirmation !== 'yes') {
    validationErrors.value.agreementConfirmation = 'Please confirm that you have read and understood the agreement'
  }

  return Object.keys(validationErrors.value).length === 0
}

const isFormComplete = computed(() => {
  return form.value.fullName.trim() &&
         form.value.age &&
         form.value.gender &&
         form.value.mobileNumber.trim() &&
         form.value.email.trim() &&
         form.value.city &&
         form.value.barangay &&
         form.value.sector &&
         form.value.services.length > 0 &&
         form.value.dataPrivacy &&
         form.value.agreementConfirmation === 'yes' &&
         validateEmail(form.value.email) &&
         validatePhoneNumber(form.value.mobileNumber)
})

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  errorMessage.value = ''
  showSuccess.value = false
  submitting.value = true

  try {
    const id = await createClientLogbookEntry({
      fullName: form.value.fullName,
      age: Number(form.value.age),
      gender: form.value.gender,
      contactNumber: form.value.mobileNumber,
      emailAddress: form.value.email,
      address: `${form.value.barangay}, ${form.value.city}`,
      city: form.value.city,
      barangay: form.value.barangay,
      sector: form.value.sector,
      serviceAvailed: form.value.services,
      dataPrivacyConsent: form.value.dataPrivacy,
      agreementConfirmed: form.value.agreementConfirmation === 'yes',
    })

    try {
      sessionStorage.setItem('evaluation_logbookId', id)
      sessionStorage.setItem('evaluation_services', JSON.stringify(form.value.services || []))
    } catch (_) {
      // ignore
    }

    // Check if DTC Training is among the services and redirect accordingly
    const hasDtcTraining = form.value.services.some(service => 
      service.toLowerCase().includes('dtc training')
    )

    if (hasDtcTraining) {
      sessionStorage.setItem('logbookId', id)
      await router.push({
        path: '/client/dtc-training-evaluation'
      })
    } else {
      // Show completion modal for non-DTC services
      logbookId.value = id
      showCompletionModal.value = true
    }
  } catch (e: any) {
    console.error('Submission failed:', e)
    errorMessage.value = e?.message || 'Failed to save logbook entry to Firestore.'
  } finally {
    submitting.value = false
  }
}

const clearForm = () => {
  form.value = {
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    email: '',
    city: '',
    barangay: '',
    sector: '',
    services: [],
    dataPrivacy: false,
    agreementConfirmation: '',
  }
  validationErrors.value = {}
}

const handleNewResponse = () => {
  showCompletionModal.value = false
  clearForm()
  window.scrollTo(0, 0)
}

const handleCloseModal = () => {
  showCompletionModal.value = false
  // Optionally redirect to a thank you page or home
  router.push('/client/logbook')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

