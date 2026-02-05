<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/users" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Users
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">User Details</h1>
        <p class="text-neutral-400 mt-1">View and manage user information</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading user...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadUser" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- User Details -->
    <div v-else-if="user" class="space-y-6">
      <!-- Main Info Card -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ getInitials(user.name || 'U') }}</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ user.name || 'Unknown User' }}</h2>
              <p class="text-sm text-neutral-400 mt-1">{{ user.email || 'N/A' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="user.is_admin" class="badge badge-primary">Admin</span>
            <span v-if="user.email_verified_at" class="badge badge-success">Verified</span>
            <span v-else class="badge badge-warning">Unverified</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">User ID</label>
            <div class="text-white font-medium">#{{ user.id }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Email</label>
            <div class="text-white">{{ user.email || 'N/A' }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Name</label>
            <div class="text-white">{{ user.name || 'N/A' }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Role</label>
            <span v-if="user.is_admin" class="badge badge-primary">Administrator</span>
            <span v-else class="badge badge-info">Regular User</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Email Verification</label>
            <div v-if="user.email_verified_at" class="text-white">
              Verified on {{ formatDate(user.email_verified_at) }}
            </div>
            <span v-else class="badge badge-warning">Not Verified</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Subscriptions</label>
            <span class="badge badge-info">{{ user.subscriptions_count || 0 }} subscriptions</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Campaigns</label>
            <span class="badge badge-info">{{ user.campaigns_count || 0 }} campaigns</span>
          </div>

          <div v-if="user.created_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Joined</label>
            <div class="text-white">{{ formatDate(user.created_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const userId = computed(() => route.params.id as string)

const user = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const { getUser } = useUsers()

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
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadUser = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getUser(userId.value)
    user.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to load user'
    console.error('Error loading user:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUser()
})

useHead({
  title: `User ${userId.value} - Admin Panel`
})
</script>
