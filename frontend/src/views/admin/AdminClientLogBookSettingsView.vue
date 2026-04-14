<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <AdminSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white shadow-sm">
        <h1 class="m-0 text-2xl font-bold">Client Logbook Settings</h1>
      </header>
      
      <main class="flex-1 px-8 py-8">
        <div class="p-8 bg-white rounded-xl shadow-sm">
          <!-- Header Section -->
          <div class="mb-8 pb-8 border-b border-gray-100">
            <h1 class="text-3xl font-bold text-gray-900 mb-3">Logbook Settings</h1>
            <p class="text-gray-600 leading-relaxed">Manage the options presented to users when filling out the client logbook.</p>
          </div>

          <!-- Navigation Tabs -->
          <div class="mb-8 pb-6 border-b border-gray-100">
            <nav class="flex gap-1 overflow-x-auto">
              <button
                @click="switchTab('services')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'services'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <span>Services ({{ formConfig.services.length }})</span>
              </button>
              <button
                @click="switchTab('sectors')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'sectors'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <span>Sectors ({{ formConfig.sectors.length }})</span>
              </button>
              <button
                @click="switchTab('geography')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'geography'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <span>Cities & Barangays</span>
              </button>
              <button
                @click="switchTab('privacy')"
                :class="[
                  'flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2',
                  activeTab === 'privacy'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                ]"
              >
                <span>Data Privacy Content</span>
              </button>
            </nav>
          </div>

          <!-- Content Section -->
          <div>
            <!-- Services Tab -->
            <div v-if="activeTab === 'services'" class="space-y-8">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Available Services</h2>
                <button
                  @click="addDynamicItem('services')"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Add Service
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(item, index) in formConfig.services" :key="index" class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all flex items-center justify-between">
                  <div class="flex-1 mr-4">
                    <input
                      v-model="item.value"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    @click="removeDynamicItem('services', index)"
                    class="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Sectors Tab -->
            <div v-if="activeTab === 'sectors'" class="space-y-8">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Available Sectors</h2>
                <button
                  @click="addDynamicItem('sectors')"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Add Sector
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(item, index) in formConfig.sectors" :key="index" class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all flex items-center justify-between">
                  <div class="flex-1 mr-4">
                    <input
                      v-model="item.value"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    @click="removeDynamicItem('sectors', index)"
                    class="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Geography Tab -->
            <div v-if="activeTab === 'geography'" class="space-y-8">
              <div class="flex flex-col lg:flex-row gap-8">
                <!-- Cities Sidebar -->
                <div class="w-full lg:w-1/3 border border-gray-200 rounded-lg overflow-hidden flex flex-col max-h-[600px]">
                  <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="font-semibold text-gray-900">Cities/Municipalities</h3>
                  <button @click="addCity" class="px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 text-sm font-medium">+ Add City</button>
                  </div>
                  <div class="overflow-y-auto flex-1">
                    <div 
                      v-for="(cityObj, index) in formConfig.cities" :key="index"
                      @click="selectedCityIndex = index"
                      :class="['p-4 border-b border-gray-100 cursor-pointer transition-colors flex justify-between items-center', selectedCityIndex === index ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50']"
                    >
                      <input 
                        v-if="cityObj.isEditing"
                        v-model="cityObj.name"
                        @blur="cityObj.isEditing = false"
                        @keyup.enter="cityObj.isEditing = false"
                        class="px-2 py-1 rounded border border-gray-300 text-sm w-full outline-none"
                        autofocus
                      />
                      <span v-else class="text-sm font-medium text-gray-800">{{ cityObj.name }}</span>
                      
                      <div class="flex gap-2">
                        <button v-if="!cityObj.isEditing" @click.stop="cityObj.isEditing = true" class="text-gray-400 hover:text-blue-600">✎</button>
                        <button @click.stop="removeCity(index)" class="text-gray-400 hover:text-red-600">✕</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Barangays List -->
                <div class="w-full lg:w-2/3 border border-gray-200 rounded-lg flex flex-col min-h-[400px]">
                  <template v-if="selectedCity">
                    <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                      <h3 class="font-semibold text-gray-900">Barangays in {{ selectedCity.name || 'Unnamed City' }}</h3>
                      <button @click="addBarangay" class="px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 text-sm font-medium">+ Add Barangay</button>
                    </div>
                    <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[500px]">
                      <div v-for="(b, bIndex) in selectedCity.barangays" :key="bIndex" class="flex items-center gap-2">
                        <input
                          v-model="b.value"
                          type="text"
                          class="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button @click="removeBarangay(bIndex)" class="text-gray-400 hover:text-red-600 p-1">✕</button>
                      </div>
                      <div v-if="selectedCity.barangays.length === 0" class="col-span-full text-center text-gray-500 py-8 italic">
                        No barangays added yet
                      </div>
                    </div>
                  </template>
                  <div v-else class="flex-1 flex items-center justify-center text-gray-500 italic p-8 text-center">
                    Select a city from the list to manage its barangays
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Privacy Tab -->
            <div v-if="activeTab === 'privacy'" class="space-y-6">
              <h2 class="text-lg font-semibold text-gray-900">Data Privacy Content</h2>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p class="text-sm text-blue-800">
                  This text is shown in the modal when users click "Data Privacy Act of 2012 (RA 10173)" link. 
                  Make sure it encompasses all legal requirements.
                </p>
              </div>
              <textarea
                v-model="formConfig.dataPrivacyText"
                rows="15"
                class="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 leading-relaxed font-sans"
              ></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-12 pt-8 border-t border-gray-200 flex justify-end gap-3">
            <button
              @click="loadConfiguration"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Reset Changes
            </button>
            <button
              @click="saveChanges"
              :disabled="saving"
              class="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getFormSettings, updateFormSettings } from '../../services/clientFormSettings'
import AdminSidebar from './AdminSidebar.vue'

const saving = ref(false)
const lastUpdated = ref('Never')
const activeTab = ref('services')
const selectedCityIndex = ref(0)

const switchTab = (tab) => {
  activeTab.value = tab
}

const formConfig = reactive({
  services: [],
  sectors: [],
  cities: [],
  dataPrivacyText: ''
})

const selectedCity = computed(() => {
  if (formConfig.cities.length === 0 || selectedCityIndex.value >= formConfig.cities.length || selectedCityIndex.value < 0) {
    return null
  }
  return formConfig.cities[selectedCityIndex.value]
})

// Default hardcoded values for initialization
const defaultBarangayData = {
  'Baco': ['Alag', 'Bangkatan', 'Baras', 'Bayanan', 'Burbuli', 'Catwiran I', 'Catwiran II', 'Dulangan I', 'Dulangan II', 'Lantuyang', 'Lumangbayan', 'Malapad', 'Mangangan I', 'Mangangan II', 'Mayabig', 'Pambisan', 'Poblacion', 'Pulantubig', 'Putican-Cabulo', 'San Andres', 'San Ignacio', 'Santa Cruz', 'Santa Rosa I', 'Santa Rosa II', 'Tabon-Tabon', 'Tagumpay', 'Water'],
  'Bansud': ['Alcadesma', 'Bato', 'Conrazon', 'Malo', 'Manihala', 'Pag-asa', 'Poblacion', 'Proper Bansud', 'Proper Tiguisan', 'Rosacara', 'Salcedo', 'Sumagui', 'Villa Pag-asa'],
  'Bongabong': ['Anilao', 'Aplaya', 'Bagong Bayan I', 'Bagong Bayan II', 'Batangan', 'Bukal', 'Camantigue', 'Carmundo', 'Cawayan', 'Dayhagan', 'Formon', 'Hagan', 'Hagupit', 'Ipil', 'Kaligtasan', 'Labasan', 'Labonan', 'Libertad', 'Lisap', 'Luna', 'Malitbog', 'Mapang', 'Masaguisi', 'Mina de Oro', 'Morente', 'Ogbot', 'Orconuma', 'Poblacion', 'Pulosahi', 'Sagana', 'San Isidro', 'San Jose', 'San Juan', 'Sigange', 'Sta. Cruz', 'Tawas'],
  'Bulalacao': ['Bagong Sikat', 'Balatasan', 'Benli', 'Cabugao', 'Cambunang', 'Campaasan', 'Liwagao', 'Maasin', 'Maujao', 'Milagrosa', 'Nasukob', 'Poblacion', 'San Francisco', 'San Isidro', 'San Juan', 'San Roque'],
  'Calapan City': ['Balingayan', 'Balite', 'Baruyan', 'Batino', 'Bayanan I', 'Bayanan II', 'Biga', 'Bondoc', 'Bucayao', 'Buhuan', 'Bulusan', 'Calero', 'Camansihan', 'Camilmil', 'Canubing I', 'Canubing II', 'Comunal', 'Guinobatan', 'Gulod', 'Gutad', 'Ibaba East', 'Ibaba West', 'Ilaya', 'Lalud', 'Lazareto', 'Libis', 'Lumangbayan', 'Mahal Na Pangalan', 'Maidlang', 'Malad', 'Malamig', 'Managpi', 'Masipit', 'Nag-Iba I', 'Nag-Iba II', 'Navotas', 'Pachoca', 'Palhi', 'Panggalaan', 'Parang', 'Patas', 'Personas', 'Putingtubig', 'San Antonio', 'San Raphael (Salong)', 'San Vicente Central', 'San Vicente East', 'San Vicente North', 'San Vicente South', 'San Vicente West', 'Sapul', 'Silonay', 'Sta. Cruz', 'Sta. Isabel', 'Santa Maria Village', 'Santa Rita', 'Santo Niño', 'Suqui', 'Tawagan', 'Tawiran', 'Tibag', 'Wawa'],
  'Gloria': ['Agsalin', 'Agos', 'Alma Villa', 'Andres Bonifacio', 'Balete', 'Banus', 'Banutan', 'Buong Lupa', 'Bulaklakan', 'Gaudencio Antonino', 'Guimbonan', 'Kawit', 'Lucio Laurel', 'Macario Adriatico', 'Malamig', 'Malayong', 'Maligaya', 'Malubay', 'Manguyang', 'Maragooc', 'Mirayan', 'Narra', 'Papandungin', 'San Antonio', 'Santa Maria', 'Santa Theresa', 'Tambong'],
  'Mansalay': ['Balugo', 'B. del Mundo', 'Bonbon', 'Budburan', 'Cabalwa', 'Don Pedro', 'Maliwanag', 'Manaul', 'Panaytayan', 'Poblacion', 'Roma', 'Sta. Brigida', 'Santa Maria', 'Sta. Teresita', 'Villa Celestial', 'Wasig', 'Waygan'],
  'Naujan': ['Poblacion I', 'Poblacion II', 'Poblacion III', 'Adrialuna', 'Andres Ylagan', 'Antipolo', 'Apitong', 'Arangin', 'Aurora', 'Bacungan', 'Bagong Buhay', 'Balite', 'Bancuro', 'Banuton', 'Barcenaga', 'Bayani', 'Buhangin', 'Caburo', 'Concepcion', 'Dao', 'Del Pilar', 'Estrella', 'Evangelista', 'Gamao', 'General Esco', 'Herrera', 'Inarawan', 'Kalinisan', 'Laguna', 'Mabini', 'Magtibay', 'Mahabang Parang', 'Malaya', 'Malinao', 'Malvar', 'Masagana', 'Masaguing', 'Melgar A', 'Melgar B', 'Metolza', 'Montelago', 'Montemayor', 'Motoderazo', 'Mulawin', 'Nag-Iba 1', 'Nag-Iba 2', 'Pagkakaisa', 'Paitan', 'Paniquian', 'Pinagsabangan 1', 'Pinagsabangan 2', 'Piñahan', 'Sampaguita', 'San Agustin 1', 'San Agustin 2', 'San Andres', 'San Antonio', 'San Carlos', 'San Isidro', 'San Jose', 'San Luis', 'San Nicolas', 'San Pedro', 'Sta. Cruz', 'Sta. Isabel', 'Sta. Maria', 'Santiago', 'Sto. Niño', 'Tagumpay', 'Tigkan'],
  'Pinamalayan': ['Anoling', 'Bacungan', 'Bangbang', 'Banilad', 'Buli', 'Cacawan', 'Calingag', 'Delrazon', 'Guinhawa', 'Inclanay', 'Lumambayan', 'Malaya', 'Maliancog', 'Maningcol', 'Marayos', 'Marfrancisco', 'Nabuslot', 'Pagalagala', 'Palayan', 'Pambisan Malaki', 'Pambisan Maliit', 'Pangao', 'Papag', 'Parang', 'Poblacion', 'Putinggapi', 'San Isidro', 'San Pedro', 'Santo Nino', 'Tabionan', 'Talabaan', 'Tanauan', 'Tarawa', 'Tumapon', 'Villa Maligaya'],
  'Pola': ['Bacawan', 'Bacungan', 'Batuhan', 'Bayanan', 'Beriara', 'Budburan', 'Cabugao Banahaw', 'Dagum', 'Ilaya', 'Labaan', 'Linawahan', 'Mabini', 'Magdugo', 'Manoot', 'Pag-asa', 'Palanas', 'Poblacion', 'San Vicente', 'Song-of-India', 'Sto. Nino', 'Tabora', 'Tarik'],
  'Puerto Galera': ['Aninuan', 'Baclayan', 'Balatero', 'Dulangan', 'Palangan', 'Sabang', 'San Antonio', 'San Isidro', 'Santo Niño', 'Sinandigan', 'Tabinay', 'Villaflor', 'Poblacion'],
  'San Teodoro': ['Zone I', 'Zone II', 'Zone III', 'Zone IV', 'Calao', 'Cawayan', 'Kay-Ibabao', 'Salingcomot'],
  'Socorro': ['Batong Dalig', 'Bayuin', 'Bugtong Na Tuog', 'Calocmoy', 'Calubayan', 'Catiningan', 'Epiz', 'Happy Valley', 'La Fortuna', 'Leuteboro I', 'Leuteboro II', 'Mabuhay I', 'Mabuhay II', 'Malugay', 'Maria Concepcion', 'Matungao', 'Monteverde', 'Pasi I', 'Pasi II', 'Santo Domingo', 'Subaan', 'Villareal', 'Zone I', 'Zone II', 'Zone III', 'Zone IV'],
  'Victoria': ['Alcate', 'Antonino', 'Babangonan', 'Bagong Buhay', 'Bagong Silang', 'Bambanin', 'Bethel', 'Canaan', 'Concepcion', 'Duongan', 'Leido', 'Loyal', 'Mabini', 'Macatoc', 'Malabo', 'Merit', 'Ordovilla', 'Pakyas', 'Poblacion I', 'Poblacion II', 'Poblacion III', 'Poblacion IV', 'Sampaguita', 'San Antonio', 'San Cristobal', 'San Gabriel', 'San Gelacio', 'San Isidro', 'San Juan', 'San Narciso', 'Urdaneta', 'Villa Cerveza']
};

const defaultPrivacyText = `Privacy Notice
In compliance with Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012, the Department of Information and Communications Technology (DICT) Oriental Mindoro is committed to protecting your personal data and upholding your right to privacy. All personal information collected through this Client Log Book system shall be processed in a lawful, fair, and transparent manner.

Collection of Personal Information
The system collects personal data including your full name, age, gender, contact number, email address, city, barangay, and details of the services you availed. The collection of such information is necessary to properly document client transactions, monitor service utilization, and generate official reports required for government operations.

Purpose and Legal Basis of Processing
Your personal data is processed for legitimate government purposes including service facilitation, client profiling, internal record-keeping, performance evaluation, and improvement of public service delivery. Processing is based on your voluntary consent and in accordance with applicable laws and regulations.

Data Protection and Security Measures
DICT Oriental Mindoro implements appropriate organizational, physical, and technical safeguards to ensure the confidentiality, integrity, and availability of your personal data. Access to the information is limited only to authorized personnel. Measures are in place to protect against unauthorized access, disclosure, alteration, or destruction of data.

Data Sharing and Retention
Personal data shall not be disclosed to unauthorized third parties. Information may only be shared when required by law, by authorized government agencies, or as necessary for official reporting. Data will be retained only for as long as necessary to fulfill the stated purposes and in accordance with government record-keeping policies.

Rights of the Data Subject
As a data subject, you have the right to be informed, to access, to correct inaccurate information, to object to processing, to request erasure or blocking of your data, and to file a complaint with the National Privacy Commission in case of violation of your data privacy rights.`

const defaultServices = [
  'Free WiFi Access',
  'PNPKI Service',
  'DICT Training',
  'TechNews',
  'ILCP',
  'Other Services'
];

const defaultSectors = [
  'Person with disability (PWD)',
  'Senior Citizen',
  'Women',
  'Out-Of-School Youth and Adults (OSYA)',
  'Overseas Filipino Workers (OFW)',
  'Student',
  'Teacher',
  'MSME\'s',
  'Indigenous People',
  'Government Workers - Local',
  'Government Workers - National',
  'Other'
];

const addDynamicItem = (category) => {
  formConfig[category].push({ value: '' })
}

const removeDynamicItem = (category, index) => {
  formConfig[category].splice(index, 1)
}

const addCity = () => {
  const newName = prompt('Enter city name:')
  if (newName && newName.trim()) {
    formConfig.cities.unshift({ name: newName.trim(), isEditing: false, barangays: [] })
    selectedCityIndex.value = 0
  }
}

const removeCity = (index) => {
  if (confirm('Are you sure you want to remove this city and all its barangays?')) {
    formConfig.cities.splice(index, 1)
    if (selectedCityIndex.value >= formConfig.cities.length) {
      selectedCityIndex.value = Math.max(0, formConfig.cities.length - 1)
    }
  }
}

const addBarangay = () => {
  if (selectedCity.value) {
    selectedCity.value.barangays.unshift({ value: '' })
  }
}

const removeBarangay = (bIndex) => {
  if (selectedCity.value) {
    selectedCity.value.barangays.splice(bIndex, 1)
  }
}

const loadConfiguration = async () => {
  try {
    const config = await getFormSettings('clientLogbook')
    
    if (config && Object.keys(config).length > 0) {
      // Decode Firestore config into Vue reactive state
      formConfig.services = (config.services || []).map(s => ({ value: s }))
      formConfig.sectors = (config.sectors || []).map(s => ({ value: s }))
      
      const cityList = []
      if (config.geography) {
        Object.entries(config.geography).forEach(([cityName, barangaysList]) => {
          cityList.push({
            name: cityName,
            isEditing: false,
            barangays: (barangaysList || []).map(b => ({ value: b }))
          })
        })
        cityList.sort((a,b) => a.name.localeCompare(b.name))
      }
      formConfig.cities = cityList
      formConfig.dataPrivacyText = config.dataPrivacyText || defaultPrivacyText
      
      if (config.updatedAt) {
        lastUpdated.value = config.updatedAt.toDate ? config.updatedAt.toDate().toLocaleString() : new Date(config.updatedAt).toLocaleString()
      }
    } else {
      // Setup Defaults
      formConfig.services = defaultServices.map(s => ({ value: s }))
      formConfig.sectors = defaultSectors.map(s => ({ value: s }))
      const cityList = []
      Object.entries(defaultBarangayData).forEach(([cityName, barangaysList]) => {
        cityList.push({
          name: cityName,
          isEditing: false,
          barangays: barangaysList.map(b => ({ value: b }))
        })
      })
      cityList.sort((a,b) => a.name.localeCompare(b.name))
      formConfig.cities = cityList
      formConfig.dataPrivacyText = defaultPrivacyText
    }
  } catch (error) {
    console.error('Error loading client logbook configuration:', error)
  }
}

const saveChanges = async () => {
  saving.value = true
  try {
    // Process formConfig into Firestore friendly object
    const services = formConfig.services.map(i => i.value.trim()).filter(Boolean)
    const sectors = formConfig.sectors.map(i => i.value.trim()).filter(Boolean)
    
    // Convert cities array back to object format mapping city -> array of barangays
    const geography = {}
    formConfig.cities.forEach(city => {
      if (city.name && city.name.trim()) {
        geography[city.name.trim()] = city.barangays.map(b => b.value.trim()).filter(Boolean)
      }
    })
    
    const dataToSave = {
      services,
      sectors,
      geography,
      dataPrivacyText: formConfig.dataPrivacyText
    }
    
    const success = await updateFormSettings(dataToSave, 'clientLogbook')
    
    if (success) {
      lastUpdated.value = new Date().toLocaleString()
      alert('Client Logbook configuration saved successfully!')
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

onMounted(() => {
  loadConfiguration()
})
</script>
