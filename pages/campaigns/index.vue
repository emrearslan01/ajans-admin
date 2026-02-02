<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Campaigns</h1>
        <p class="text-neutral-400 mt-1">Manage marketing campaigns and track performance</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Total</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.total || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Active</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.active || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Pending</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.pending || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Paused</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.paused || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Completed</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.completed || 0 }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <select v-model="statusFilter" class="input-field" @change="loadCampaigns">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
        <select v-model="platformFilter" class="input-field" @change="loadCampaigns">
          <option value="">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
        </select>
        <button @click="loadCampaigns" class="btn-secondary">Filter</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading campaigns...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadCampaigns" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Campaigns List -->
    <div v-else class="card p-6">
      <div v-if="campaigns.length === 0" class="text-center py-12">
        <p class="text-neutral-400">No campaigns found</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-primary-500/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 bg-brown-500/20 rounded-lg">
              <svg class="w-6 h-6 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">{{ campaign.platform || 'N/A' }} Campaign</h3>
              <p class="text-sm text-neutral-400">{{ campaign.user?.name || 'Unknown User' }}</p>
              <p class="text-xs text-neutral-500 mt-1">{{ campaign.profile_url || 'No profile URL' }}</p>
            </div>
          </div>
          <div>
            <span :class="getStatusBadgeClass(campaign.status)">{{ campaign.status }}</span>
          </div>
          <div class="text-sm text-neutral-400">
            <div>Plan: {{ campaign.plan?.name || 'N/A' }}</div>
            <div>Tasks: {{ campaign.fulfillment_tasks?.length || 0 }}</div>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/campaigns/${campaign.id}`" class="text-primary-400 hover:text-primary-300">View</NuxtLink>
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
const campaigns = ref<any[]>([])
const stats = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const statusFilter = ref('')
const platformFilter = ref('')
const pagination = ref<any>(null)

const { getCampaigns, getStats } = useCampaigns()

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'badge badge-success',
    pending: 'badge badge-warning',
    paused: 'badge badge-warning',
    completed: 'badge badge-info',
  }
  return classes[status] || 'badge badge-info'
}

const loadCampaigns = async (page = 1) => {
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
    
    if (platformFilter.value) {
      params.platform = platformFilter.value
    }
    
    const response = await getCampaigns(params)
    campaigns.value = response.data
    pagination.value = response.meta
  } catch (err: any) {
    error.value = err.message || 'Failed to load campaigns'
    console.error('Error loading campaigns:', err)
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
    loadCampaigns(page)
  }
}

onMounted(() => {
  loadStats()
  loadCampaigns()
})

useHead({
  title: 'Campaigns - Admin Panel'
})
</script>
