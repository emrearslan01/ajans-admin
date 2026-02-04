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
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
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
            <button @click="editTask(task)" class="text-primary-400 hover:text-primary-300">Edit</button>
            <button @click="deleteTask(task.id)" class="text-red-400 hover:text-red-300">Delete</button>
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

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingTask"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="card p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">
            {{ editingTask ? 'Edit Task' : 'Create New Task' }}
          </h2>
          <button @click="closeModal" class="text-neutral-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveTask" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Campaign *</label>
            <select
              v-model.number="taskForm.campaign_id"
              required
              class="input-field w-full"
              :disabled="loadingCampaigns"
            >
              <option value="">Select Campaign</option>
              <option v-for="campaign in availableCampaigns" :key="campaign.id" :value="campaign.id">
                {{ campaign.platform }} - {{ campaign.user?.name || 'Unknown' }} ({{ campaign.profile_url }})
              </option>
            </select>
            <p v-if="loadingCampaigns" class="text-xs text-neutral-500 mt-1">Loading campaigns...</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Service Type *</label>
            <input
              v-model="taskForm.service_type"
              type="text"
              required
              class="input-field w-full"
              placeholder="e.g., followers, likes, views"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Daily Limit *</label>
            <input
              v-model.number="taskForm.daily_limit"
              type="number"
              min="0"
              required
              class="input-field w-full"
              placeholder="0"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Status *</label>
            <select v-model="taskForm.status" required class="input-field w-full">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Panel Name</label>
            <input
              v-model="taskForm.panel_name"
              type="text"
              class="input-field w-full"
              placeholder="Optional panel name"
            />
          </div>

          <div v-if="formError" class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p class="text-red-400 text-sm">{{ formError }}</p>
          </div>

          <div class="flex items-center gap-4 pt-4">
            <button type="submit" class="btn-primary flex-1" :disabled="saving">
              {{ saving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </form>
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
const editingTask = ref<any>(null)
const saving = ref(false)
const formError = ref<string | null>(null)
const availableCampaigns = ref<any[]>([])
const loadingCampaigns = ref(false)

const taskForm = ref({
  campaign_id: null as number | null,
  service_type: '',
  daily_limit: 0,
  status: 'pending',
  panel_name: '',
})

const { getTasks, createTask: createTaskApi, updateTask: updateTaskApi, deleteTask: deleteTaskApi } = useFulfillmentTasks()
const { getCampaigns } = useCampaigns()

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
    active: 'badge badge-success',
    paused: 'badge badge-warning',
    completed: 'badge badge-info',
    cancelled: 'badge badge-danger',
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

const loadAvailableCampaigns = async () => {
  loadingCampaigns.value = true
  try {
    const response = await getCampaigns({ per_page: 100 })
    availableCampaigns.value = response.data || []
  } catch (err) {
    console.error('Error loading campaigns:', err)
  } finally {
    loadingCampaigns.value = false
  }
}

const editTask = (task: any) => {
  editingTask.value = task
  taskForm.value = {
    campaign_id: task.campaign_id || null,
    service_type: task.service_type || '',
    daily_limit: task.daily_limit || 0,
    status: task.status || 'pending',
    panel_name: task.panel_name || '',
  }
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingTask.value = null
  formError.value = null
  taskForm.value = {
    campaign_id: null,
    service_type: '',
    daily_limit: 0,
    status: 'pending',
    panel_name: '',
  }
}

const saveTask = async () => {
  saving.value = true
  formError.value = null

  try {
    if (editingTask.value) {
      await updateTaskApi(editingTask.value.id, taskForm.value)
    } else {
      await createTaskApi(taskForm.value)
    }
    await loadTasks(pagination.value?.current_page || 1)
    closeModal()
  } catch (err: any) {
    formError.value = err.message || 'Failed to save task'
    console.error('Error saving task:', err)
  } finally {
    saving.value = false
  }
}

const deleteTask = async (id: number) => {
  if (!confirm('Are you sure you want to delete this task?')) {
    return
  }
  
  try {
    await deleteTaskApi(id)
    await loadTasks(pagination.value?.current_page || 1)
  } catch (err: any) {
    alert(err.message || 'Failed to delete task')
    console.error('Error deleting task:', err)
  }
}

onMounted(() => {
  loadTasks()
  loadAvailableCampaigns()
})

useHead({
  title: 'Fulfillment Tasks - Admin Panel'
})
</script>
