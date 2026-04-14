<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 text-center mb-4">
          {{ formConfig.title }}
        </h1>
        <div class="text-sm text-gray-600 text-center space-y-2">
          <p>
            {{ formConfig.description }}
          </p>
        </div>
      </div>

      <!-- Step 1: Personal Information, Data Privacy, Training Information -->
      <div v-if="currentStep === 1" class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Full Name (First Name, Middle Initial, Last Name)
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

        <h3 class="text-xl font-semibold text-gray-800 mb-2">Data Privacy</h3>
        <div class="mb-8">
         
          <p class="text-sm text-gray-600 mb-4">
            The DICT recognizes their responsibilities under the Republic Act No. 10173 (Act), also known as the Data Privacy Act of 2012. The personal data to be obtained from this interview will be analyzed, entered, and stored within the Department's authorized information and communications system and will only be accessed by the DICT Oriental Mindoro and authorized personnel. The DICT Oriental Mindoro instituted appropriate organizational, technical, and physical security measures to ensure the protection of the participants' personal data.
          </p>
    
          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">
              By answering our evaluation form, you explicitly consent to the collection, processing, and storage of your personal information by members of the DICT Oriental Mindoro-Digital Transformation Center for the purposes described above.
            </p>
            <label class="flex items-center">
              <input
                v-model="form.agreement"
                type="checkbox"
                required
                class="mr-2"
              />
              <span class="text-sm font-medium text-gray-700">I agree</span>
            </label>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-gray-800 mb-6">Training Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Resource Person Name *
            </label>
            <select
              v-model="form.resourcePerson"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            >
              <option value="">Select Resource Person</option>
              <option v-for="person in formConfig.resourcePersons" :key="person.value" :value="person.value">
                {{ person.value }}
              </option>
              <option value="other">Other</option>
            </select>
            <input
              v-if="form.resourcePerson === 'other'"
              v-model="form.otherResourcePerson"
              type="text"
              placeholder="Please specify"
              class="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">
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

      <!-- Navigation Buttons -->
      <div class="bg-white rounded-lg shadow-lg p-6 mt-2">
        <div class="flex justify-between items-center">
          <div></div>
          <div class="flex space-x-8">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              type="button"
                class="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-xs sm:text-sm"
           >
              Previous
            </button>
            
            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              type="button"
              :disabled="!isCurrentStepComplete"
              :class="[
                'w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors text-xs sm:text-sm',
                isCurrentStepComplete 
                  ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
           >
              Next
            </button>
            
            <button
              v-if="currentStep === totalSteps"
              @click="submitForm"
              :disabled="isSubmitting"
              class="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
           
              {{ isSubmitting ? 'Submitting...' : 'Submit Evaluation' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md mx-4">
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
             class="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors text-xs sm:text-sm"
           >
           Close
          </button> 
         
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createDtcTrainingEvaluation } from '@/services/clientServices'
import { getFormSettings } from '@/services/clientFormSettings'

const router = useRouter()
const isSubmitting = ref(false)
const currentStep = ref(1)
const totalSteps = 4
const showSuccess = ref(false)
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
