<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/content-boosts" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Content Boosts
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Content Boost Details</h1>
        <p class="text-neutral-400 mt-1">View and manage content boost request</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading content boost...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadContentBoost" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Content Boost Details -->
    <div v-else-if="boost" class="space-y-6">
      <!-- Main Info Card -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="p-4 bg-primary-500/20 rounded-lg">
              <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ boost.platform || 'N/A' }} Content Boost</h2>
              <p class="text-sm text-neutral-400 mt-1">ID: {{ boost.id }}</p>
            </div>
          </div>
          <div>
            <span :class="getStatusBadgeClass(boost.status)">{{ boost.status }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">User</label>
            <div class="text-white">
              <div class="font-medium">{{ boost.user?.name || 'Unknown User' }}</div>
              <div class="text-sm text-neutral-400">{{ boost.user?.email || 'N/A' }}</div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Platform</label>
            <span class="badge badge-info capitalize">{{ boost.platform || 'N/A' }}</span>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Content URL</label>
            <a 
              v-if="boost.content_url" 
              :href="boost.content_url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-primary-400 hover:text-primary-300 break-all"
            >
              {{ boost.content_url }}
            </a>
            <span v-else class="text-neutral-400">No URL provided</span>
          </div>

          <div v-if="boost.created_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Created At</label>
            <div class="text-white">{{ formatDate(boost.created_at) }}</div>
          </div>

          <div v-if="boost.completed_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Completed At</label>
            <div class="text-white">{{ formatDate(boost.completed_at) }}</div>
          </div>
        </div>

        <div v-if="boost.admin_notes" class="mt-6 pt-6 border-t border-neutral-800">
          <label class="block text-sm font-medium text-neutral-400 mb-2">Admin Notes</label>
          <div class="text-white bg-neutral-800/50 p-4 rounded-lg">
            {{ boost.admin_notes }}
          </div>
        </div>
      </div>

      <!-- Actions Card -->
      <div class="card p-6">
        <h3 class="text-lg font-bold text-white mb-4">Actions</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Update Status</label>
            <select
              :value="boost.status"
              @change="updateBoostStatus(boost.id, $event)"
              class="input-field w-full"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Admin Notes (Optional)</label>
            <textarea
              v-model="adminNotes"
              rows="3"
              class="input-field w-full"
              placeholder="Add notes about this content boost..."
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="boost.status === 'pending'"
              @click="markAsProcessing"
              class="btn-primary"
              :disabled="updating"
            >
              {{ updating ? 'Processing...' : 'Mark as Processing' }}
            </button>
            <button
              v-if="boost.status === 'processing'"
              @click="markAsCompleted"
              class="btn-primary"
              :disabled="updating"
            >
              {{ updating ? 'Completing...' : 'Mark as Completed' }}
            </button>
            <button
              v-if="boost.status !== 'cancelled'"
              @click="cancelBoost"
              class="btn-secondary"
              :disabled="updating"
            >
              {{ updating ? 'Cancelling...' : 'Cancel Boost' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const boostId = computed(() => route.params.id as string)

const boost = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const updating = ref(false)
const adminNotes = ref('')

const { getContentBoost, updateStatus } = useContentBoosts()

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
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadContentBoost = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getContentBoost(boostId.value)
    boost.value = response.data
    adminNotes.value = response.data.admin_notes || ''
  } catch (err: any) {
    error.value = err.message || 'Failed to load content boost'
    console.error('Error loading content boost:', err)
  } finally {
    loading.value = false
  }
}

const updateBoostStatus = async (boostId: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value
  
  updating.value = true
  
  try {
    await updateStatus(boostId, newStatus, adminNotes.value || undefined)
    await loadContentBoost()
  } catch (err: any) {
    alert(err.message || 'Failed to update boost status')
    console.error('Error updating boost status:', err)
  } finally {
    updating.value = false
  }
}

const markAsProcessing = async () => {
  updating.value = true
  try {
    await updateStatus(boost.value.id, 'processing', adminNotes.value || undefined)
    await loadContentBoost()
  } catch (err: any) {
    alert(err.message || 'Failed to mark as processing')
    console.error('Error:', err)
  } finally {
    updating.value = false
  }
}

const markAsCompleted = async () => {
  updating.value = true
  try {
    await updateStatus(boost.value.id, 'completed', adminNotes.value || undefined)
    await loadContentBoost()
  } catch (err: any) {
    alert(err.message || 'Failed to mark as completed')
    console.error('Error:', err)
  } finally {
    updating.value = false
  }
}

const cancelBoost = async () => {
  if (!confirm('Are you sure you want to cancel this content boost?')) {
    return
  }
  
  updating.value = true
  try {
    await updateStatus(boost.value.id, 'cancelled', adminNotes.value || undefined)
    await loadContentBoost()
  } catch (err: any) {
    alert(err.message || 'Failed to cancel boost')
    console.error('Error:', err)
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  loadContentBoost()
})

useHead({
  title: `Content Boost ${boostId.value} - Admin Panel`
})
</script>
