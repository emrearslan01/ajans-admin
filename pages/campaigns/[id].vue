<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/campaigns" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Campaigns
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Campaign Details</h1>
        <p class="text-neutral-400 mt-1">View and manage campaign information</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading campaign...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadCampaign" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Campaign Details -->
    <div v-else-if="campaign" class="space-y-6">
      <!-- Main Info Card -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-brown-500/20 rounded-lg">
              <svg class="w-8 h-8 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ campaign.platform || 'N/A' }} Campaign</h2>
              <p class="text-sm text-neutral-400 mt-1">ID: {{ campaign.id }}</p>
            </div>
          </div>
          <div>
            <span :class="getStatusBadgeClass(campaign.status)">{{ campaign.status }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">User</label>
            <div class="text-white">
              <div class="font-medium">{{ campaign.user?.name || 'Unknown User' }}</div>
              <div class="text-sm text-neutral-400">{{ campaign.user?.email || 'N/A' }}</div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Platform</label>
            <div class="text-white font-medium">{{ campaign.platform || 'N/A' }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Profile URL</label>
            <a 
              v-if="campaign.profile_url" 
              :href="campaign.profile_url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-primary-400 hover:text-primary-300 break-all"
            >
              {{ campaign.profile_url }}
            </a>
            <span v-else class="text-neutral-400">No profile URL</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Plan</label>
            <div class="text-white font-medium">{{ campaign.plan?.name || 'N/A' }}</div>
          </div>

          <div v-if="campaign.started_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Started At</label>
            <div class="text-white">{{ formatDate(campaign.started_at) }}</div>
          </div>

          <div v-if="campaign.ends_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Ends At</label>
            <div class="text-white">{{ formatDate(campaign.ends_at) }}</div>
          </div>

          <div v-if="campaign.created_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Created At</label>
            <div class="text-white">{{ formatDate(campaign.created_at) }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Fulfillment Tasks</label>
            <span class="badge badge-info">{{ campaign.fulfillment_tasks?.length || 0 }} tasks</span>
          </div>
        </div>

        <div v-if="campaign.notes" class="mt-6 pt-6 border-t border-neutral-800">
          <label class="block text-sm font-medium text-neutral-400 mb-2">Notes</label>
          <div class="text-white bg-neutral-800/50 p-4 rounded-lg">
            {{ campaign.notes }}
          </div>
        </div>
      </div>

      <!-- Actions Card -->
      <div class="card p-6">
        <h3 class="text-lg font-bold text-white mb-4">Actions</h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Update Status</label>
            <select
              :value="campaign.status"
              @change="updateCampaignStatus(campaign.id, $event)"
              class="input-field w-full"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <button
              v-if="campaign.status === 'pending'"
              @click="approveCampaign"
              class="btn-primary"
              :disabled="updating"
            >
              {{ updating ? 'Approving...' : 'Approve Campaign' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Fulfillment Tasks -->
      <div v-if="campaign.fulfillment_tasks && campaign.fulfillment_tasks.length > 0" class="card p-6">
        <h3 class="text-lg font-bold text-white mb-4">Fulfillment Tasks</h3>
        <div class="space-y-3">
          <div
            v-for="task in campaign.fulfillment_tasks"
            :key="task.id"
            class="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-white">Task #{{ task.id }}</div>
                <div class="text-xs text-neutral-400 mt-1">
                  Service: {{ task.service_type || 'N/A' }} | 
                  Daily Limit: {{ task.daily_limit || 0 }} |
                  Panel: {{ task.panel_name || 'N/A' }}
                </div>
              </div>
              <span :class="getTaskStatusBadgeClass(task.status)">{{ task.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const campaignId = computed(() => route.params.id as string)

const campaign = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const updating = ref(false)

const { getCampaign, updateStatus } = useCampaigns()

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'badge badge-success',
    pending: 'badge badge-warning',
    paused: 'badge badge-warning',
    completed: 'badge badge-info',
  }
  return classes[status] || 'badge badge-info'
}

const getTaskStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'badge badge-warning',
    active: 'badge badge-success',
    paused: 'badge badge-warning',
    completed: 'badge badge-info',
    cancelled: 'badge badge-danger',
  }
  return classes[status] || 'badge badge-info'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadCampaign = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getCampaign(campaignId.value)
    campaign.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to load campaign'
    console.error('Error loading campaign:', err)
  } finally {
    loading.value = false
  }
}

const updateCampaignStatus = async (campaignId: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value
  
  updating.value = true
  
  try {
    await updateStatus(campaignId, newStatus)
    await loadCampaign()
  } catch (err: any) {
    alert(err.message || 'Failed to update campaign status')
    console.error('Error updating campaign status:', err)
  } finally {
    updating.value = false
  }
}

const approveCampaign = async () => {
  if (!confirm('Are you sure you want to approve this campaign?')) {
    return
  }
  
  updating.value = true
  
  try {
    await updateStatus(campaign.value.id, 'active')
    await loadCampaign()
    alert('Campaign approved successfully!')
  } catch (err: any) {
    alert(err.message || 'Failed to approve campaign')
    console.error('Error approving campaign:', err)
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  loadCampaign()
})

useHead({
  title: `Campaign ${campaignId.value} - Admin Panel`
})
</script>
