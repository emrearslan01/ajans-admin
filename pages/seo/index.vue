<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">SEO Settings</h1>
      <p class="text-neutral-400 mt-1">Manage robots.txt and sitemap.xml settings</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading SEO settings...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadSettings" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Settings Form -->
    <div v-else class="space-y-6">
      <!-- Robots.txt Settings -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-white">Robots.txt Settings</h2>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="settings.robots_enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-primary-500 focus:ring-primary-500"
            />
            <span class="text-neutral-300">Enable robots.txt</span>
          </label>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">
              User Agent
            </label>
            <input
              v-model="settings.robots_user_agent"
              type="text"
              placeholder="*"
              class="input-field w-full"
            />
            <p class="text-xs text-neutral-500 mt-1">Default: * (all crawlers)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">
              Disallow Paths
            </label>
            <div class="space-y-2">
              <div
                v-for="(path, index) in disallowPaths"
                :key="index"
                class="flex items-center gap-2"
              >
                <input
                  v-model="disallowPaths[index]"
                  type="text"
                  placeholder="/admin"
                  class="input-field flex-1"
                />
                <button
                  @click="removeDisallowPath(index)"
                  class="btn-secondary px-3 py-2 text-red-400 hover:bg-red-500/20"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                @click="addDisallowPath"
                class="btn-secondary text-sm"
              >
                + Add Disallow Path
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">
              Allow Paths (Optional)
            </label>
            <div class="space-y-2">
              <div
                v-for="(path, index) in allowPaths"
                :key="index"
                class="flex items-center gap-2"
              >
                <input
                  v-model="allowPaths[index]"
                  type="text"
                  placeholder="/public"
                  class="input-field flex-1"
                />
                <button
                  @click="removeAllowPath(index)"
                  class="btn-secondary px-3 py-2 text-red-400 hover:bg-red-400/20"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                @click="addAllowPath"
                class="btn-secondary text-sm"
              >
                + Add Allow Path
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">
              Sitemap URL
            </label>
            <input
              v-model="settings.robots_sitemap_url"
              type="text"
              placeholder="/sitemap.xml"
              class="input-field w-full"
            />
          </div>

          <!-- Robots.txt Preview -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-neutral-300 mb-2">
              Preview
            </label>
            <div class="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <pre class="text-sm text-neutral-300 whitespace-pre-wrap font-mono">{{ robotsPreview }}</pre>
            </div>
            <button
              @click="updateRobotsPreview"
              class="btn-secondary mt-2 text-sm"
            >
              Refresh Preview
            </button>
          </div>
        </div>
      </div>

      <!-- Sitemap Settings -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-white">Sitemap.xml Settings</h2>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="settings.sitemap_enabled"
              type="checkbox"
              class="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-primary-500 focus:ring-primary-500"
            />
            <span class="text-neutral-300">Enable sitemap</span>
          </label>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">
              Excluded Paths
            </label>
            <div class="space-y-2">
              <div
                v-for="(path, index) in excludedPaths"
                :key="index"
                class="flex items-center gap-2"
              >
                <input
                  v-model="excludedPaths[index]"
                  type="text"
                  placeholder="/admin"
                  class="input-field flex-1"
                />
                <button
                  @click="removeExcludedPath(index)"
                  class="btn-secondary px-3 py-2 text-red-400 hover:bg-red-500/20"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                @click="addExcludedPath"
                class="btn-secondary text-sm"
              >
                + Add Excluded Path
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">
              Page Priorities
            </label>
            <div class="space-y-2">
              <div
                v-for="(priority, path) in priorities"
                :key="path"
                class="flex items-center gap-2"
              >
                <input
                  :value="path"
                  type="text"
                  placeholder="/"
                  class="input-field flex-1"
                  readonly
                />
                <input
                  v-model="priorities[path]"
                  type="text"
                  placeholder="1.0"
                  class="input-field w-24"
                />
                <button
                  @click="removePriority(path)"
                  class="btn-secondary px-3 py-2 text-red-400 hover:bg-red-500/20"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newPriorityPath"
                  type="text"
                  placeholder="/new-page"
                  class="input-field flex-1"
                />
                <input
                  v-model="newPriorityValue"
                  type="text"
                  placeholder="0.8"
                  class="input-field w-24"
                />
                <button
                  @click="addPriority"
                  class="btn-secondary"
                >
                  Add
                </button>
              </div>
            </div>
            <p class="text-xs text-neutral-500 mt-1">Priority range: 0.0 to 1.0</p>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end gap-4">
        <button
          @click="loadSettings"
          class="btn-secondary"
        >
          Reset
        </button>
        <button
          @click="saveSettings"
          :disabled="saving"
          class="btn-primary"
        >
          <span v-if="saving">Saving...</span>
          <span v-else>Save Settings</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useApi()
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const robotsPreview = ref('')

const settings = ref({
  robots_enabled: true,
  robots_user_agent: '*',
  robots_disallow_paths: [] as string[],
  robots_allow_paths: [] as string[],
  robots_sitemap_url: '/sitemap.xml',
  sitemap_enabled: true,
  sitemap_excluded_paths: [] as string[],
  sitemap_priority: {} as Record<string, string>,
})

const disallowPaths = ref<string[]>([])
const allowPaths = ref<string[]>([])
const excludedPaths = ref<string[]>([])
const priorities = ref<Record<string, string>>({})
const newPriorityPath = ref('')
const newPriorityValue = ref('0.8')

const loadSettings = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get<{ data: Record<string, any> }>('/admin/seo-settings')
    const data = response.data

    // Convert string values to proper types
    settings.value = {
      robots_enabled: data.robots_enabled === '1' || data.robots_enabled === true,
      robots_user_agent: data.robots_user_agent || '*',
      robots_disallow_paths: Array.isArray(data.robots_disallow_paths) 
        ? data.robots_disallow_paths 
        : [],
      robots_allow_paths: Array.isArray(data.robots_allow_paths)
        ? data.robots_allow_paths
        : [],
      robots_sitemap_url: data.robots_sitemap_url || '/sitemap.xml',
      sitemap_enabled: data.sitemap_enabled === '1' || data.sitemap_enabled === true,
      sitemap_excluded_paths: Array.isArray(data.sitemap_excluded_paths)
        ? data.sitemap_excluded_paths
        : [],
      sitemap_priority: typeof data.sitemap_priority === 'object' && data.sitemap_priority !== null
        ? data.sitemap_priority
        : {},
    }

    disallowPaths.value = [...settings.value.robots_disallow_paths]
    allowPaths.value = [...settings.value.robots_allow_paths]
    excludedPaths.value = [...settings.value.sitemap_excluded_paths]
    priorities.value = { ...settings.value.sitemap_priority }

    await updateRobotsPreview()
  } catch (err: any) {
    error.value = err.message || 'Failed to load SEO settings'
    console.error('Error loading SEO settings:', err)
  } finally {
    loading.value = false
  }
}

const updateRobotsPreview = async () => {
  try {
    const response = await api.get<{ content: string }>('/admin/seo-settings/robots-preview')
    robotsPreview.value = response.content
  } catch (err: any) {
    console.error('Error loading robots preview:', err)
    robotsPreview.value = 'Error loading preview'
  }
}

const saveSettings = async () => {
  saving.value = true
  error.value = null

  try {
    // Update settings with current form values
    settings.value.robots_disallow_paths = disallowPaths.value.filter(p => p.trim() !== '')
    settings.value.robots_allow_paths = allowPaths.value.filter(p => p.trim() !== '')
    settings.value.sitemap_excluded_paths = excludedPaths.value.filter(p => p.trim() !== '')
    settings.value.sitemap_priority = priorities.value

    await api.put('/admin/seo-settings', settings.value)
    
    alert('SEO settings saved successfully!')
    await loadSettings()
  } catch (err: any) {
    error.value = err.message || 'Failed to save SEO settings'
    console.error('Error saving SEO settings:', err)
  } finally {
    saving.value = false
  }
}

// Path management functions
const addDisallowPath = () => {
  disallowPaths.value.push('')
}

const removeDisallowPath = (index: number) => {
  disallowPaths.value.splice(index, 1)
}

const addAllowPath = () => {
  allowPaths.value.push('')
}

const removeAllowPath = (index: number) => {
  allowPaths.value.splice(index, 1)
}

const addExcludedPath = () => {
  excludedPaths.value.push('')
}

const removeExcludedPath = (index: number) => {
  excludedPaths.value.splice(index, 1)
}

const addPriority = () => {
  if (newPriorityPath.value.trim() && newPriorityValue.value.trim()) {
    priorities.value[newPriorityPath.value.trim()] = newPriorityValue.value.trim()
    newPriorityPath.value = ''
    newPriorityValue.value = '0.8'
  }
}

const removePriority = (path: string) => {
  delete priorities.value[path]
}

onMounted(() => {
  loadSettings()
})
</script>
