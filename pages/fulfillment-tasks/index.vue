<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Fulfillment Tasks</h1>
        <p class="text-neutral-400 mt-1">Manage and track fulfillment tasks</p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="showCreateModal = true">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Task
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <select v-model="statusFilter" class="input-field" @change="loadTasks">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <button @click="loadTasks" class="btn-secondary">Filter</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading tasks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadTasks" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Tasks List -->
    <div v-else class="card p-6">
      <div v-if="tasks.length === 0" class="text-center py-12">
        <p class="text-neutral-400">No tasks found</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-primary-500/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 bg-yellow-500/20 rounded-lg">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Task #{{ task.id }}</h3>
              <p class="text-sm text-neutral-400">Campaign: {{ task.campaign?.user?.name || 'N/A' }}</p>
              <p class="text-xs text-neutral-500 mt-1">Due: {{ formatDate(task.due_date) }}</p>
            </div>
          </div>
          <div>
            <span :class="getStatusBadgeClass(task.status)">{{ task.status }}</span>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/fulfillment-tasks/${task.id}`" class="text-primary-400 hover:text-primary-300">View</NuxtLink>
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
const tasks = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const statusFilter = ref('')
const pagination = ref<any>(null)
const showCreateModal = ref(false)

const { getTasks } = useFulfillmentTasks()

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge badge-warning',
    in_progress: 'badge badge-info',
    completed: 'badge badge-success',
    failed: 'badge badge-danger',
  }
  return classes[status] || 'badge badge-info'
}

const loadTasks = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params: any = {
      per_page: 15,
      page,
    }
    
    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    
    const response = await getTasks(params)
    tasks.value = response.data
    pagination.value = response.meta
  } catch (err: any) {
    error.value = err.message || 'Failed to load tasks'
    console.error('Error loading tasks:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadTasks(page)
  }
}

onMounted(() => {
  loadTasks()
})

useHead({
  title: 'Fulfillment Tasks - Admin Panel'
})
</script>
