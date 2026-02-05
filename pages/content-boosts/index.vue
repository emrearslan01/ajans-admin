<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Content Boosts</h1>
        <p class="text-neutral-400 mt-1">Manage content boost requests and track performance</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Total</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.total || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Pending</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.pending || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Processing</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.processing || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Completed</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.completed || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Cancelled</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.cancelled || 0 }}</p>
      </div>
    </div>

    <!-- Platform Stats -->
    <div v-if="stats?.by_platform" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Instagram</h3>
        <p class="text-3xl font-bold text-white">{{ stats.by_platform.instagram || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">TikTok</h3>
        <p class="text-3xl font-bold text-white">{{ stats.by_platform.tiktok || 0 }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <select v-model="statusFilter" class="input-field" @change="loadContentBoosts">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select v-model="platformFilter" class="input-field" @change="loadContentBoosts">
          <option value="">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
        </select>
        <button @click="loadContentBoosts" class="btn-secondary">Filter</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading content boosts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadContentBoosts" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Content Boosts List -->
    <div v-else class="card overflow-hidden">
      <div v-if="contentBoosts.length === 0" class="text-center py-12">
        <p class="text-neutral-400">No content boosts found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-neutral-800/50 border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Content</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Platform</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr
              v-for="boost in contentBoosts"
              :key="boost.id"
              class="hover:bg-neutral-800/30 transition-colors"
            >
              <td class="px-6 py-4">
                <div>
                  <a 
                    :href="boost.content_url" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-primary-400 hover:text-primary-300 text-sm break-all"
                  >
                    {{ boost.content_url }}
                  </a>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-300">{{ boost.user?.name || 'Unknown User' }}</div>
                <div class="text-xs text-neutral-500">{{ boost.user?.email || '' }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="badge badge-info capitalize">{{ boost.platform || 'N/A' }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadgeClass(boost.status)">{{ boost.status }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-400">{{ formatDate(boost.created_at) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <NuxtLink 
                    :to="`/content-boosts/${boost.id}`" 
                    class="text-primary-400 hover:text-primary-300 text-sm font-medium"
                  >
                    View
                  </NuxtLink>
                  <select
                    :value="boost.status"
                    @change="updateBoostStatus(boost.id, $event)"
                    class="input-field text-sm py-1 px-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination" class="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
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
const contentBoosts = ref<any[]>([])
const stats = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const statusFilter = ref('')
const platformFilter = ref('')
const pagination = ref<any>(null)

const { getContentBoosts, getStats, updateStatus } = useContentBoosts()

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge badge-warning',
    processing: 'badge badge-info',
    completed: 'badge badge-success',
    cancelled: 'badge badge-danger',
  }
  return classes[status] || 'badge badge-info'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadContentBoosts = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params: any = {
      per_page: 20,
      page,
    }
    
    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    
    if (platformFilter.value) {
      params.platform = platformFilter.value
    }
    
    const response = await getContentBoosts(params)
    contentBoosts.value = response.data
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total,
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load content boosts'
    console.error('Error loading content boosts:', err)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await getStats()
    stats.value = response.data
  } catch (err: any) {
    console.error('Error loading stats:', err)
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadContentBoosts(page)
  }
}

const updateBoostStatus = async (boostId: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value
  
  try {
    await updateStatus(boostId, newStatus)
    await loadContentBoosts(pagination.value?.current_page || 1)
    await loadStats()
  } catch (err: any) {
    alert(err.message || 'Failed to update boost status')
    console.error('Error updating boost status:', err)
    // Reload to reset dropdown
    await loadContentBoosts(pagination.value?.current_page || 1)
  }
}

onMounted(() => {
  loadStats()
  loadContentBoosts()
})

useHead({
  title: 'Content Boosts - Admin Panel'
})
</script>
