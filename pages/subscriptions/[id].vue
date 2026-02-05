<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/subscriptions" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Subscriptions
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Subscription Details</h1>
        <p class="text-neutral-400 mt-1">View and manage subscription information</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading subscription...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadSubscription" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Subscription Details -->
    <div v-else-if="subscription" class="space-y-6">
      <!-- Main Info Card -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ getInitials(subscription.user?.name || 'U') }}</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Subscription #{{ subscription.id }}</h2>
              <p class="text-sm text-neutral-400 mt-1">{{ subscription.plan?.name || 'No Plan' }}</p>
            </div>
          </div>
          <div>
            <span :class="getStatusBadgeClass(subscription.status)">{{ subscription.status }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">User</label>
            <div class="text-white">
              <div class="font-medium">{{ subscription.user?.name || 'Unknown User' }}</div>
              <div class="text-sm text-neutral-400">{{ subscription.user?.email || 'N/A' }}</div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Plan</label>
            <div class="text-white font-medium">{{ subscription.plan?.name || 'N/A' }}</div>
            <div class="text-sm text-neutral-400">${{ parseFloat(subscription.plan?.price || 0).toFixed(2) }}/month</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Provider</label>
            <div class="text-white font-medium capitalize">{{ subscription.provider || 'N/A' }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Status</label>
            <span :class="getStatusBadgeClass(subscription.status)">{{ subscription.status }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Period Start</label>
            <div class="text-white">{{ formatDate(subscription.period_start) }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Period End</label>
            <div class="text-white">{{ formatDate(subscription.period_end) }}</div>
          </div>

          <div v-if="subscription.created_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Created At</label>
            <div class="text-white">{{ formatDate(subscription.created_at) }}</div>
          </div>

          <div v-if="subscription.updated_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Last Updated</label>
            <div class="text-white">{{ formatDate(subscription.updated_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const subscriptionId = computed(() => route.params.id as string)

const subscription = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const { getSubscription } = useSubscriptions()

const getInitials = (name: string) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
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

const loadSubscription = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getSubscription(subscriptionId.value)
    subscription.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to load subscription'
    console.error('Error loading subscription:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSubscription()
})

useHead({
  title: `Subscription ${subscriptionId.value} - Admin Panel`
})
</script>
