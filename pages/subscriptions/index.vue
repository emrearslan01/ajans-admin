<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Subscriptions</h1>
        <p class="text-neutral-400 mt-1">Manage all active and pending subscriptions</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Total</h3>
        <p class="text-2xl font-bold text-white">{{ stats?.total || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">All subscriptions</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Active</h3>
        <p class="text-2xl font-bold text-white">{{ stats?.active || 0 }}</p>
        <p class="text-xs text-primary-400 mt-2">Currently active</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Paused</h3>
        <p class="text-2xl font-bold text-white">{{ stats?.paused || 0 }}</p>
        <p class="text-xs text-yellow-400 mt-2">Paused subscriptions</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Cancelled</h3>
        <p class="text-2xl font-bold text-white">{{ stats?.cancelled || 0 }}</p>
        <p class="text-xs text-red-400 mt-2">Cancelled subscriptions</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <select v-model="statusFilter" class="input-field" @change="loadSubscriptions">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
        <button @click="loadSubscriptions" class="btn-secondary">Filter</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading subscriptions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadSubscriptions" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Subscriptions List -->
    <div v-else class="card p-6">
      <div v-if="subscriptions.length === 0" class="text-center py-12">
        <p class="text-neutral-400">No subscriptions found</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="subscription in subscriptions"
          :key="subscription.id"
          class="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-primary-500/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span class="text-lg font-bold text-white">{{ getInitials(subscription.user?.name || 'U') }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-white">{{ subscription.user?.name || 'Unknown User' }}</h3>
              <p class="text-sm text-neutral-400">{{ subscription.plan?.name || 'No Plan' }}</p>
              <p class="text-xs text-neutral-500 mt-1">{{ subscription.user?.email }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-white">${{ parseFloat(subscription.plan?.price || 0).toFixed(2) }}</p>
            <p class="text-xs text-neutral-400">{{ subscription.provider || 'N/A' }}</p>
          </div>
          <div>
            <span :class="getStatusBadgeClass(subscription.status)">{{ subscription.status }}</span>
          </div>
          <div class="text-sm text-neutral-400 min-w-[120px]">
            <div>Start: {{ formatDate(subscription.period_start) }}</div>
            <div>End: {{ formatDate(subscription.period_end) }}</div>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/subscriptions/${subscription.id}`" class="text-primary-400 hover:text-primary-300">View</NuxtLink>
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
const subscriptions = ref<any[]>([])
const stats = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const statusFilter = ref('')
const pagination = ref<any>(null)

const { getSubscriptions, getStats } = useSubscriptions()

// Helper functions
const getInitials = (name: string) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

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
    active: 'badge badge-success',
    paused: 'badge badge-warning',
    cancelled: 'badge badge-danger',
    expired: 'badge badge-danger',
  }
  return classes[status] || 'badge badge-info'
}

// Load subscriptions
const loadSubscriptions = async (page = 1) => {
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
    
    const response = await getSubscriptions(params)
    subscriptions.value = response.data
    pagination.value = response.meta
  } catch (err: any) {
    error.value = err.message || 'Failed to load subscriptions'
    console.error('Error loading subscriptions:', err)
  } finally {
    loading.value = false
  }
}

// Load stats
const loadStats = async () => {
  try {
    const response = await getStats()
    stats.value = response.data
  } catch (err: any) {
    console.error('Error loading stats:', err)
  }
}

// Change page
const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadSubscriptions(page)
  }
}

// Load data on mount
onMounted(() => {
  loadStats()
  loadSubscriptions()
})

useHead({
  title: 'Subscriptions - Admin Panel'
})
</script>
