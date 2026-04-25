<template>
  <div class="min-h-screen bg-gray-50/50 pt-8 pb-32 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Logos -->
      <div class="flex flex-row items-center justify-center gap-4 mb-6 w-full">
        <img src="/dictlogo2.png" alt="DICT Logo" class="h-12 sm:h-16 w-auto object-contain"/>
        <img src="/Bagongpilipinas.png" alt="Bagong Pilipinas Logo" class="h-12 sm:h-16 w-auto object-contain"/>
      </div>

      <!-- Header -->
      <div class="bg-[#133e75] rounded-lg p-8 mb-6">
        <h1 class="text-4xl font-bold text-white text-center mb-2">
          {{ formConfig.title }}
        </h1>
        <div class="text-xl text-white text-center space-y-2">
          <p>
            {{ formConfig.description }}
          </p>
        </div>
      </div>

      <!-- Step 1: Personal Information, Data Privacy, Training Information -->
      <div v-if="currentStep === 1" class="bg-white rounded-lg p-8">
        <h2 class="text-3xl font-semibold text-gray-800 mb-6">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label class="block text-lg text-gray-700 mb-2">
              Email *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            />
          </div>
          <div>
            <label class="block text-lg  text-gray-700 mb-2">
              Full Name (First Name, M.I, Last Name)
            </label>
            <input
              v-model="form.fullName"
              type="text"
              required
              placeholder="Juan P. Dela Cruz"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            />
          </div>
        </div>

        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Data Privacy</h3>
        <div class="mb-8">
         
          <p class="text-base text-gray-600 mb-4">
            The DICT recognizes their responsibilities under the Republic Act No. 10173 (Act), also known as the Data Privacy Act of 2012. The personal data to be obtained from this interview will be analyzed, entered, and stored within the Department's authorized information and communications system and will only be accessed by the DICT Oriental Mindoro and authorized personnel. The DICT Oriental Mindoro instituted appropriate organizational, technical, and physical security measures to ensure the protection of the participants' personal data.
          </p>
    
          <div class="mb-4">
            <p class="text-base text-gray-700 mb-2">
              By answering our evaluation form, you explicitly consent to the collection, processing, and storage of your personal information by members of the DICT Oriental Mindoro-Digital Transformation Center for the purposes described above.
            </p>
            <label class="flex items-center">
              <input
                v-model="form.agreement"
                type="checkbox"
                required
                class="mr-2"
              />
              <span class="text-base font-medium text-gray-700">I agree</span>
            </label>
          </div>
        </div>

        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Training Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-lg text-gray-700 mb-2">
              Resource Person Name *
            </label>
            <div class="relative custom-dropdown">
              <button 
                type="button" 
                @click.stop="showResourcePersonDropdown = !showResourcePersonDropdown"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-left flex justify-between items-center text-gray-700 bg-white"
              >
                <span>{{ form.resourcePerson === 'other' ? (form.otherResourcePerson || 'Other (Please specify)') : (form.resourcePerson || 'Select Resource Person') }}</span>
                <svg class="w-5 h-5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showResourcePersonDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="showResourcePersonDropdown" class="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                  <div class="py-1">
                    <button 
                      v-for="person in formConfig.resourcePersons" 
                      :key="person.value"
                      type="button" 
                      @click="selectResourcePerson(person.value)" 
                      class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
                      :class="form.resourcePerson === person.value ? 'bg-blue-50 text-[#133e75]' : 'text-gray-700'"
                    >
                      {{ person.value }}
                    </button>
                    <button 
                      type="button" 
                      @click="selectResourcePerson('other')" 
                      class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-sm font-medium border-t border-gray-50"
                      :class="form.resourcePerson === 'other' ? 'bg-blue-50 text-[#133e75]' : 'text-gray-700'"
                    >
                      Other
                    </button>
                  </div>
                </div>
              </transition>
            </div>
            <input
              v-if="form.resourcePerson === 'other'"
              v-model="form.otherResourcePerson"
              type="text"
              placeholder="Please specify"
              class="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            />
          </div>
          <div>
            <label class="block text-lg text-gray-700 mb-2">
              Training/Activity Title *
            </label>
            <input
              v-model="form.trainingTitle"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-lg text-gray-700 mb-2">
              Date of the training *
            </label>
            <input
              v-model="form.trainingDate"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Resource Person Evaluation -->
      <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">RESOURCE PERSON EVALUATION</h2>
          <div class="text-sm text-gray-500 mb-4">
            <strong>1 – Very Poor | 2 – Poor | 3 – Fair | 4 – Good | 5 – Excellent</strong>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="question in formConfig.resourcePersonQuestions" :key="question.key" class="border-b pb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">{{ question.text }}</p>
            <div class="flex items-center gap-1">
              <button
                v-for="rating in 5"
                :key="rating"
                type="button"
                class="p-1 rounded hover:bg-slate-100 transition"
                @click="form.resourcePersonEvaluation[question.key] = rating"
                :aria-label="'Rate ' + rating + ' out of 5'"
                :aria-pressed="form.resourcePersonEvaluation[question.key] === rating"
              >
                <svg
                  class="h-7 w-7"
                  viewBox="0 0 20 20"
                  :fill="rating <= form.resourcePersonEvaluation[question.key] ? '#f59e0b' : 'none'"
                  :stroke="rating <= form.resourcePersonEvaluation[question.key] ? '#f59e0b' : '#94a3b8'"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linejoin="round"
                    d="M10 1.6l2.66 5.39 5.95.86-4.31 4.2 1.02 5.92L10 15.19 4.68 17.97l1.02-5.92-4.31-4.2 5.95-.86L10 1.6z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Course Content Evaluation -->
      <div v-if="currentStep === 3" class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">COURSE CONTENT EVALUATION</h2>
          <div class="text-sm text-gray-500 mb-4">
            <strong>1 – Very Poor | 2 – Poor | 3 – Fair | 4 – Good | 5 – Excellent</strong>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="question in formConfig.courseContentQuestions" :key="question.key" class="border-b pb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">{{ question.text }}</p>
            <div class="flex items-center gap-1">
              <button
                v-for="rating in 5"
                :key="rating"
                type="button"
                class="p-1 rounded hover:bg-slate-100 transition"
                @click="form.courseContentEvaluation[question.key] = rating"
                :aria-label="'Rate ' + rating + ' out of 5'"
                :aria-pressed="form.courseContentEvaluation[question.key] === rating"
              >
                <svg
                  class="h-7 w-7"
                  viewBox="0 0 20 20"
                  :fill="rating <= form.courseContentEvaluation[question.key] ? '#f59e0b' : 'none'"
                  :stroke="rating <= form.courseContentEvaluation[question.key] ? '#f59e0b' : '#94a3b8'"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linejoin="round"
                    d="M10 1.6l2.66 5.39 5.95.86-4.31 4.2 1.02 5.92L10 15.19 4.68 17.97l1.02-5.92-4.31-4.2 5.95-.86L10 1.6z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Venue Evaluation -->
      <div v-if="currentStep === 4" class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">VENUE/VICINITY EVALUATION</h2>
          <div class="text-sm text-gray-500 mb-4">
            <strong>1 – Very Poor | 2 – Poor | 3 – Fair | 4 – Good | 5 – Excellent</strong>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="question in formConfig.venueQuestions" :key="question.key" class="border-b pb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">{{ question.text }}</p>
            <div class="flex items-center gap-1">
              <button
                v-for="rating in 5"
                :key="rating"
                type="button"
                class="p-1 rounded hover:bg-slate-100 transition"
                @click="form.venueEvaluation[question.key] = rating"
                :aria-label="'Rate ' + rating + ' out of 5'"
                :aria-pressed="form.venueEvaluation[question.key] === rating"
              >
                <svg
                  class="h-7 w-7"
                  viewBox="0 0 20 20"
                  :fill="rating <= form.venueEvaluation[question.key] ? '#f59e0b' : 'none'"
                  :stroke="rating <= form.venueEvaluation[question.key] ? '#f59e0b' : '#94a3b8'"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linejoin="round"
                    d="M10 1.6l2.66 5.39 5.95.86-4.31 4.2 1.02 5.92L10 15.19 4.68 17.97l1.02-5.92-4.31-4.2 5.95-.86L10 1.6z"
                  />
                </svg>
              </button>
            </div>

          </div>
        </div>

      </div>

      <!-- Navigation Buttons (Fixed Bottom) -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 sm:p-6 z-50">
        <div class="max-w-4xl mx-auto flex justify-between items-center px-4">
          <div></div>
          <div class="flex space-x-4 sm:space-x-8">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              type="button"
              class="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-semibold text-sm sm:text-base border border-gray-200"
            >
              Previous
            </button>
            
            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              type="button"
              :disabled="!isCurrentStepComplete"
              :class="[
                'px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-all font-semibold text-sm sm:text-base',
                isCurrentStepComplete 
                  ? 'bg-[#133e75] text-white hover:bg-[#133e75]/90 shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              ]"
            >
              Next
            </button>
            
            <button
              v-if="currentStep === totalSteps"
              @click="submitForm"
              :disabled="isSubmitting"
              class="bg-green-600 text-white px-6 py-2.5 sm:px-8 rounded-full font-bold hover:bg-green-700 disabled:bg-gray-300 transition-all shadow-md items-center flex gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSubmitting ? 'Submitting...' : 'Submit Evaluation' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div class="bg-white  border border-gray-200  rounded-xl p-8 max-w-md mx-4">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Thank You!</h3>
          <div class="text-sm text-gray-600 space-y-2 mb-6">
            <p>
              Thank you for your enthusiasm and participation in the DTC-Technical Training! Your dedication is commendable, and congratulations on your successful completion of the program. We trust that your newfound knowledge and training experience will be invaluable to you. Stay updated by following our Facebook Page for upcoming events, free trainings, and webinars tailored just for you!
            </p>
            <p>
              We look forward to welcoming you to our future sessions!
            </p>
            <p class="font-medium">
              DICT Oriental Mindoro Official FB Page: 
              <a href="https://www.facebook.com/dictr4borientalmindoro/" target="_blank" class="text-blue-600 hover:underline">
                https://www.facebook.com/dictr4borientalmindoro/
              </a>
            </p>
          </div>
          <button
            type="button"
            @click="closeSuccessAndRedirect"
             class="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 items-center rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors text-xs sm:text-sm"
           >
           Close
          </button> 
         
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createDtcTrainingEvaluation } from '@/services/clientServices'
import { getFormSettings } from '@/services/clientFormSettings'

const router = useRouter()
const isSubmitting = ref(false)
const currentStep = ref(1)
const totalSteps = 4
const showSuccess = ref(false)
const showResourcePersonDropdown = ref(false)
const logbookId = ref('')

// Form configuration from Firestore
const formConfig = ref({
  title: '',
  description: '',
  resourcePersonQuestions: [],
  courseContentQuestions: [],
  venueQuestions: [],
  resourcePersons: []
})

const form = reactive({
  email: '',
  fullName: '',
  agreement: false,
  resourcePerson: '',
  otherResourcePerson: '',
  trainingTitle: '',
  trainingDate: '',
  resourcePersonEvaluation: {},
  courseContentEvaluation: {},
  venueEvaluation: {}
})

// Load form configuration
const loadFormConfig = async () => {
  try {
    const config = await getFormSettings('dtcEvaluation')
    
    if (config) {
      formConfig.value = {
        title: config.title || 'DTC Training Course Evaluation Form',
        description: config.description || 'Please provide your honest feedback on the training course.',
        resourcePersonQuestions: config.resourcePersonQuestions || [],
        courseContentQuestions: config.courseContentQuestions || [],
        venueQuestions: config.venueQuestions || [],
        // Load resourcePersons from database if they exist
        resourcePersons: config.resourcePersons || []
      }
    }
  } catch (error) {
    console.error('Error loading form configuration:', error)
  }
}

const isStep1Complete = computed(() => {
  return (
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.fullName.trim() &&
    form.agreement &&
    form.resourcePerson &&
    (form.resourcePerson !== 'other' || form.otherResourcePerson.trim()) &&
    form.trainingTitle.trim() &&
    form.trainingDate
  )
})

const isStep2Complete = computed(() => {
  // If no questions are loaded yet, consider it incomplete
  if (!formConfig.value.resourcePersonQuestions || formConfig.value.resourcePersonQuestions.length === 0) {
    return false
  }
  const requiredQuestions = formConfig.value.resourcePersonQuestions.length
  const answeredQuestions = Object.keys(form.resourcePersonEvaluation).length
  return answeredQuestions >= requiredQuestions
})

const isStep3Complete = computed(() => {
  // If no questions are loaded yet, consider it incomplete
  if (!formConfig.value.courseContentQuestions || formConfig.value.courseContentQuestions.length === 0) {
    return false
  }
  const requiredQuestions = formConfig.value.courseContentQuestions.length
  const answeredQuestions = Object.keys(form.courseContentEvaluation).length
  return answeredQuestions >= requiredQuestions
})

const isStep4Complete = computed(() => {
  // If no questions are loaded yet, consider it incomplete
  if (!formConfig.value.venueQuestions || formConfig.value.venueQuestions.length === 0) {
    return false
  }
  const requiredQuestions = formConfig.value.venueQuestions.length
  const answeredQuestions = Object.keys(form.venueEvaluation).length
  return answeredQuestions >= requiredQuestions
})

const isCurrentStepComplete = computed(() => {
  switch (currentStep.value) {
    case 1: return isStep1Complete.value
    case 2: return isStep2Complete.value
    case 3: return isStep3Complete.value
    case 4: return isStep4Complete.value
    default: return false
  }
})

const nextStep = () => {
  if (isCurrentStepComplete.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectResourcePerson = (val) => {
  form.resourcePerson = val
  showResourcePersonDropdown.value = false
  if (val !== 'other') {
    form.otherResourcePerson = ''
  }
}

const clearForm = () => {
  form.email = ''
  form.fullName = ''
  form.agreement = false
  form.resourcePerson = ''
  form.otherResourcePerson = ''
  form.trainingTitle = ''
  form.trainingDate = ''
  form.resourcePersonEvaluation = {}
  form.courseContentEvaluation = {}
  form.venueEvaluation = {}
}

onMounted(() => {

  loadFormConfig()
  
 
  const storedLogbookId = sessionStorage.getItem('logbookId')
  if (storedLogbookId) {
    logbookId.value = storedLogbookId
    sessionStorage.removeItem('logbookId') 
  }

  // Click outside listener for dropdown
  const handleOutsideClick = (e) => {
    if (!e.target.closest('.custom-dropdown')) {
      showResourcePersonDropdown.value = false
    }
  }
  window.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick)
})

const submitForm = async () => {
  try {
    isSubmitting.value = true

    const evaluationData = {
      logbookId: logbookId.value,
      email: form.email,
      fullName: form.fullName,
      resourcePerson: form.resourcePerson === 'other' ? form.otherResourcePerson : form.resourcePerson,
      trainingTitle: form.trainingTitle,
      trainingDate: form.trainingDate,
      resourcePersonEvaluation: form.resourcePersonEvaluation,
      courseContentEvaluation: form.courseContentEvaluation,
      venueEvaluation: form.venueEvaluation,
      submittedAt: new Date().toISOString()
    }

    await createDtcTrainingEvaluation(evaluationData)
    showSuccess.value = true

    // Reset form
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'object') {
        form[key] = {}
      } else {
        form[key] = ''
      }
    })
    form.agreement = false

  } catch (error) {
    console.error('Error submitting evaluation:', error)
    alert('Error submitting evaluation. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccessAndRedirect = () => {
  showSuccess.value = false
  router.push('/client/logbook')
}
</script>

<style scoped>

input[type="radio"]:checked + span {
  font-weight: bold;
  color: #2563eb;
}
</style>
