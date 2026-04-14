<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <AdminSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white shadow-sm">
        <h1 class="m-0 text-2xl font-bold">DTC Evaluation Form Management</h1>
      </header>
      
      <main class="flex-1 px-8 py-8">
        <div class="p-8 bg-white rounded-xl shadow-sm">
          <!-- Header Section -->
          <div class="mb-8 pb-8 border-b border-gray-100">
            <h1 class="text-3xl font-bold text-gray-900 mb-3">DTC Training Course Evaluation Form</h1>
            <p class="text-gray-600 leading-relaxed">{{ formConfig.description }}</p>
            <p class="text-xs text-gray-400 mt-4">Last updated: {{ lastUpdated }}</p>
          </div>

          <!-- Navigation Tabs -->
          <div class="mb-8 pb-6 border-b border-gray-100">
            <nav class="flex gap-1 overflow-x-auto">
              <button
                @click="switchTab('header')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'header'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Header
              </button>
              <button
                @click="switchTab('resourcePerson')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'resourcePerson'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Resource Person ({{ formConfig.resourcePersonQuestions.length }})</span>
              </button>
              <button
                @click="switchTab('courseContent')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'courseContent'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Course Content ({{ formConfig.courseContentQuestions.length }})</span>
              </button>
              <button
                @click="switchTab('venue')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'venue'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Venue ({{ formConfig.venueQuestions.length }})</span>
              </button>
              <button
                @click="switchTab('resourcePersons')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'resourcePersons'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Resource Persons ({{ formConfig.resourcePersons.length }})</span>
              </button>
            </nav>
          </div>

          <!-- Content Section -->
          <div>
            <!-- Form Header Tab -->
            <div v-if="activeTab === 'header'" class="space-y-8">
              <div>
                <label for="title" class="block text-sm font-semibold text-gray-900 mb-3">Form Title</label>
                <input
                  id="title"
                  v-model="formConfig.title"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label for="description" class="block text-sm font-semibold text-gray-900 mb-3">Description</label>
                <textarea
                  id="description"
                  v-model="formConfig.description"
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 leading-relaxed"
                ></textarea>
              </div>
            </div>

            <!-- Resource Person Questions Tab -->
            <div v-if="activeTab === 'resourcePerson'" class="space-y-8">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Resource Person Evaluation Questions</h2>
                <button
                  @click="addQuestion('resourcePerson')"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(question, index) in formConfig.resourcePersonQuestions" :key="index" class="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <span class="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Q{{ index + 1 }}</span>
                    <div class="flex gap-2">
                      <button
                        v-if="!question.isEditing"
                        @click="toggleEdit('resourcePerson', index)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="question.isEditing"
                        @click="saveEdit('resourcePerson', index)"
                        class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="removeQuestion('resourcePerson', index)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-if="!question.isEditing" class="text-gray-700 leading-relaxed text-base">
                    {{ question.text }}
                  </div>
                  <textarea
                    v-else
                    v-model="question.text"
                    class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    @keyup.enter="saveEdit('resourcePerson', index)"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Course Content Questions Tab -->
            <div v-if="activeTab === 'courseContent'" class="space-y-8">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Course Content Evaluation Questions</h2>
                <button
                  @click="addQuestion('courseContent')"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(question, index) in formConfig.courseContentQuestions" :key="index" class="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <span class="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Q{{ index + 1 }}</span>
                    <div class="flex gap-2">
                      <button
                        v-if="!question.isEditing"
                        @click="toggleEdit('courseContent', index)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="question.isEditing"
                        @click="saveEdit('courseContent', index)"
                        class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="removeQuestion('courseContent', index)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-if="!question.isEditing" class="text-gray-700 leading-relaxed text-base">
                    {{ question.text }}
                  </div>
                  <textarea
                    v-else
                    v-model="question.text"
                    class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    @keyup.enter="saveEdit('courseContent', index)"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Venue Questions Tab -->
            <div v-if="activeTab === 'venue'" class="space-y-8">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Venue Evaluation Questions</h2>
                <button
                  @click="addQuestion('venue')"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(question, index) in formConfig.venueQuestions" :key="index" class="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <span class="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Q{{ index + 1 }}</span>
                    <div class="flex gap-2">
                      <button
                        v-if="!question.isEditing"
                        @click="toggleEdit('venue', index)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="question.isEditing"
                        @click="saveEdit('venue', index)"
                        class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="removeQuestion('venue', index)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-if="!question.isEditing" class="text-gray-700 leading-relaxed text-base">
                    {{ question.text }}
                  </div>
                  <textarea
                    v-else
                    v-model="question.text"
                    class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    @keyup.enter="saveEdit('venue', index)"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Resource Persons Tab -->
            <div v-if="activeTab === 'resourcePersons'" class="space-y-8">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Resource Persons</h2>
                <button
                  @click="addResourcePerson"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Person
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(person, index) in formConfig.resourcePersons" :key="index" class="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div class="flex items-center justify-between gap-4">
                    <div class="flex-1">
                      <div v-if="!person.isEditing" class="text-gray-700 leading-relaxed text-base">
                        {{ person.value || 'Click edit to add name' }}
                      </div>
                      <input
                        v-else
                        v-model="formConfig.resourcePersons[index].value"
                        type="text"
                        class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        @keyup.enter="saveResourcePersonEdit(index)"
                      />
                    </div>
                    <div class="flex gap-2">
                      <button
                        v-if="!person.isEditing"
                        @click="toggleResourcePersonEdit(index)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="person.isEditing"
                        @click="saveResourcePersonEdit(index)"
                        class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="removeResourcePerson(index)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-12 pt-8 border-t border-gray-200 flex justify-end gap-3">
            <button
              @click="resetToDefault"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Reset to Default
            </button>
            <button
              @click="saveChanges"
              :disabled="saving"
              class="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { getFormSettings, updateFormSettings } from '../../services/clientFormSettings'
import AdminSidebar from './AdminSidebar.vue'

const saving = ref(false)
const lastUpdated = ref(new Date().toLocaleString())
const activeTab = ref('header')

const switchTab = (tab) => {
  activeTab.value = tab
}

const formConfig = reactive({
  title: 'DTC Training Course Evaluation Form',
  description: 'Please provide your honest feedback on the training course covering instructor effectiveness, course content, venue facilities, and overall experience.',
  resourcePersonQuestions: [
    { key: 'rp_assistance', text: 'Assistance provided', isEditing: false },
    { key: 'rp_attire', text: 'Proper attire/appearance', isEditing: false },
    { key: 'rp_authority', text: 'Authority/command of subject', isEditing: false },
    { key: 'rp_courtesy', text: 'Courtesy/politeness', isEditing: false },
    { key: 'rp_current_developments', text: 'Knowledge of current developments', isEditing: false },
    { key: 'rp_discipline', text: 'Classroom discipline', isEditing: false },
    { key: 'rp_engagement', text: 'Audience engagement', isEditing: false },
    { key: 'rp_exercises', text: 'Quality of exercises', isEditing: false },
    { key: 'rp_explanation', text: 'Clarity of explanation', isEditing: false },
    { key: 'rp_fluency', text: 'Speaking fluency', isEditing: false },
    { key: 'rp_interest', text: 'Ability to generate interest', isEditing: false },
    { key: 'rp_knowledge', text: 'Depth of knowledge', isEditing: false },
    { key: 'rp_materials', text: 'Use of training materials', isEditing: false },
    { key: 'rp_motivation', text: 'Motivational skills', isEditing: false },
    { key: 'rp_notes_usage', text: 'Usage of notes/outline', isEditing: false },
    { key: 'rp_openness', text: 'Openness to questions', isEditing: false },
    { key: 'rp_organization', text: 'Organization of presentation', isEditing: false },
    { key: 'rp_punctuality', text: 'Punctuality', isEditing: false },
    { key: 'rp_time_management', text: 'Time management', isEditing: false },
    { key: 'rp_voice', text: 'Voice quality/clarity', isEditing: false }
  ],
  courseContentQuestions: [
    { key: 'content_amount', text: 'Amount of content covered', isEditing: false },
    { key: 'content_applicability', text: 'Applicability to work', isEditing: false },
    { key: 'content_arrangement', text: 'Logical arrangement', isEditing: false },
    { key: 'content_demonstration', text: 'Demonstration/examples', isEditing: false },
    { key: 'content_difficulty', text: 'Difficulty level', isEditing: false },
    { key: 'content_discussion_time', text: 'Time for discussion', isEditing: false },
    { key: 'content_interaction', text: 'Participant interaction', isEditing: false },
    { key: 'content_interest', text: 'Interest level', isEditing: false },
    { key: 'content_methods', text: 'Teaching methods', isEditing: false },
    { key: 'content_relevance', text: 'Relevance to objectives', isEditing: false },
    { key: 'content_responsiveness', text: 'Responsiveness to needs', isEditing: false },
    { key: 'content_sequence', text: 'Content sequence', isEditing: false },
    { key: 'content_skills', text: 'Skills development', isEditing: false },
    { key: 'content_time', text: 'Time allocation', isEditing: false },
    { key: 'content_topic_time', text: 'Time per topic', isEditing: false },
    { key: 'content_visual_aids', text: 'Visual aids quality', isEditing: false }
  ],
  venueQuestions: [
    { key: 'venue_cleanliness', text: 'Cleanliness of venue', isEditing: false },
    { key: 'venue_internet', text: 'Internet connectivity', isEditing: false },
    { key: 'venue_lighting', text: 'Lighting conditions', isEditing: false },
    { key: 'venue_safety', text: 'Safety measures', isEditing: false },
    { key: 'venue_seating', text: 'Seating comfort', isEditing: false }
  ],
  resourcePersons: []
})

const generateKey = (text) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50)
}

const addQuestion = (category) => {
  const newQuestion = {
    key: `question_${Date.now()}`,
    text: '',
    isEditing: true
  }
  formConfig[`${category}Questions`].push(newQuestion)
}

const removeQuestion = (category, index) => {
  formConfig[`${category}Questions`].splice(index, 1)
}

const toggleEdit = (category, index) => {
  formConfig[`${category}Questions`].forEach((q, i) => {
    if (i !== index) {
      q.isEditing = false
    }
  })
  formConfig[`${category}Questions`][index].isEditing = !formConfig[`${category}Questions`][index].isEditing
}

const saveEdit = (category, index) => {
  formConfig[`${category}Questions`][index].isEditing = false
  if (!formConfig[`${category}Questions`][index].key || formConfig[`${category}Questions`][index].key.startsWith('question_')) {
    formConfig[`${category}Questions`][index].key = generateKey(formConfig[`${category}Questions`][index].text)
  }
}

const addResourcePerson = () => {
  formConfig.resourcePersons.push({ value: '', isEditing: true })
}

const removeResourcePerson = (index) => {
  formConfig.resourcePersons.splice(index, 1)
}

const toggleResourcePersonEdit = (index) => {
  formConfig.resourcePersons.forEach((person, i) => {
    if (i !== index) {
      person.isEditing = false
    }
  })
  formConfig.resourcePersons[index].isEditing = !formConfig.resourcePersons[index].isEditing
}

const saveResourcePersonEdit = (index) => {
  formConfig.resourcePersons[index].isEditing = false
}

const resetToDefault = async () => {
  if (!confirm('Reset all questions to default? This cannot be undone.')) {
    return
  }
  
  await loadDefaultConfig()
  await saveChanges()
}

const loadDefaultConfig = async () => {
  // This would load from a default configuration
}

const saveChanges = async () => {
  saving.value = true
  try {
    console.log('Save function called')
    console.log('Form config to save:', formConfig)
    
    const success = await updateFormSettings(formConfig, 'dtcEvaluation')
    console.log('Update result:', success)
    
    if (success) {
      lastUpdated.value = new Date().toLocaleString()
      alert('DTC Evaluation form configuration saved successfully!')
    } else {
      alert('Error saving configuration. Please try again.')
    }
  } catch (error) {
    console.error('Error saving form configuration:', error)
    alert('Error saving configuration. Please try again.')
  } finally {
    saving.value = false
  }
}

const loadConfiguration = async () => {
  try {
    console.log('Loading configuration...')
    const config = await getFormSettings('dtcEvaluation')
    console.log('Config loaded:', config)
    
    // Update formConfig with loaded data
    if (config) {
      if (config.resourcePersonQuestions) {
        formConfig.resourcePersonQuestions = config.resourcePersonQuestions
      }
      if (config.courseContentQuestions) {
        formConfig.courseContentQuestions = config.courseContentQuestions
      }
      if (config.venueQuestions) {
        formConfig.venueQuestions = config.venueQuestions
      }
      // Load resourcePersons from database if they exist
      if (config.resourcePersons) {
        formConfig.resourcePersons = config.resourcePersons
      }
      if (config.title) {
        formConfig.title = config.title
      }
      if (config.description) {
        formConfig.description = config.description
      }
    }
    
    // Ensure all items have isEditing property
    ['resourcePersonQuestions', 'courseContentQuestions', 'venueQuestions', 'resourcePersons'].forEach(category => {
      formConfig[category].forEach(item => {
        item.isEditing = false
      })
    })
  } catch (error) {
    console.error('Error loading form configuration:', error)
  }
}

onMounted(() => {
  loadConfiguration()
})
</script>