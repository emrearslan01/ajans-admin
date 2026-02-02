<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Activity Logs</h1>
        <p class="text-neutral-400 mt-1">System activity and audit trail</p>
      </div>
      <div class="flex items-center gap-4">
        <select v-model="actionFilter" class="input-field" @change="loadLogs">
          <option value="">All Activities</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
          <option value="status_changed">Status Changed</option>
        </select>
        <button class="btn-secondary">Export Logs</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading activity logs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadLogs" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Activity Logs -->
    <div v-else class="card p-6">
      <div v-if="logs.length === 0" class="text-center py-12">
        <p class="text-neutral-400">No activity logs found</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="log in logs"
          :key="log.id"
          class="flex items-start gap-4 p-4 bg-neutral-800/30 rounded-lg border-l-4"
          :class="getBorderColor(log.action)"
        >
          <div class="p-2 rounded-lg" :class="getIconBgClass(log.action)">
            <svg class="w-5 h-5" :class="getIconColorClass(log.action)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(log.action)" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-white">{{ formatActionType(log.action) }}</h3>
              <span class="text-xs text-neutral-400">{{ formatTimeAgo(log.created_at) }}</span>
            </div>
            <p class="text-sm text-neutral-400">{{ log.description || 'No description' }}</p>
            <p class="text-xs text-neutral-500 mt-1">
              User: {{ log.user?.name || 'System' }} • 
              Model: {{ log.model_type || 'N/A' }} • 
              ID: #{{ log.model_id || 'N/A' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination" class="mt-6 pt-6 border-t border-neutral-800 flex items-center justify-between">
        <div class="text-sm text-neutral-400">
          Showing <span class="text-white font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> 
          to <span class="text-white font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span> 
          of <span class="text-white font-medium">{{ pagination.total }}</span> results
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const logs = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const actionFilter = ref('')
const pagination = ref<any>(null)

const { getLogs } = useActivityLogs()

const formatActionType = (action: string) => {
  if (!action) return 'Activity'
  return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const formatTimeAgo = (date: string) => {
  if (!date) return 'Unknown'
  const now = new Date()
  const logDate = new Date(date)
  const diffMs = now.getTime() - logDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return new Date(date).toLocaleDateString()
}

const getBorderColor = (action: string) => {
  const colors: Record<string, string> = {
    created: 'border-primary-500',
    updated: 'border-primary-500',
    deleted: 'border-red-500',
    status_changed: 'border-yellow-500',
  }
  return colors[action] || 'border-neutral-500'
}

const getIconBgClass = (action: string) => {
  const classes: Record<string, string> = {
    created: 'bg-primary-500/20',
    updated: 'bg-primary-500/20',
    deleted: 'bg-red-500/20',
    status_changed: 'bg-yellow-500/20',
  }
  return classes[action] || 'bg-neutral-500/20'
}

const getIconColorClass = (action: string) => {
  const classes: Record<string, string> = {
    created: 'text-primary-400',
    updated: 'text-primary-400',
    deleted: 'text-red-400',
    status_changed: 'text-yellow-400',
  }
  return classes[action] || 'text-neutral-400'
}

const getIconPath = (action: string) => {
  const paths: Record<string, string> = {
    created: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    updated: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    deleted: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    status_changed: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  }
  return paths[action] || 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
}

const loadLogs = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params: any = {
      per_page: 15,
      page,
    }
    
    if (actionFilter.value) {
      params.action = actionFilter.value
    }
    
    const response = await getLogs(params)
    logs.value = response.data
    pagination.value = response.meta
  } catch (err: any) {
    error.value = err.message || 'Failed to load activity logs'
    console.error('Error loading logs:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadLogs(page)
  }
}

onMounted(() => {
  loadLogs()
})

useHead({
  title: 'Activity Logs - Admin Panel'
})
</script>
