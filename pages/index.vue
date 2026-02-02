<template>
  <div class="p-6 space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-primary-500/20 rounded-lg">
            <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Total Users</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.totalUsers || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">All registered users</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-primary-500/20 rounded-lg">
            <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Active Subscriptions</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.subscriptions?.active || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">Currently active</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-brown-500/20 rounded-lg">
            <svg class="w-6 h-6 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Active Campaigns</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.campaigns?.active || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">Running campaigns</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-yellow-500/20 rounded-lg">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Pending Tasks</h3>
        <p class="text-3xl font-bold text-white">{{ pendingTasksCount || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">Require attention</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-red-500/20 rounded-lg">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Open Tickets</h3>
        <p class="text-3xl font-bold text-white">0</p>
        <p class="text-xs text-neutral-500 mt-2">
          <NuxtLink to="/tickets" class="text-primary-400 hover:text-primary-300">View all →</NuxtLink>
        </p>
      </div>
    </div>

    <!-- Charts and Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 card p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-semibold text-white">Revenue Overview</h2>
            <p class="text-sm text-neutral-400">Last 30 days performance</p>
          </div>
          <select class="input-field text-sm py-1.5">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-neutral-800 rounded-lg">
          <div class="text-center">
            <svg class="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-neutral-400">Chart will be displayed here</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-white mb-6">Recent Activity</h2>
        <div v-if="loadingActivity" class="space-y-4">
          <div v-for="i in 4" :key="i" class="flex items-start gap-3">
            <div class="w-2 h-2 bg-neutral-700 rounded-full mt-2 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-neutral-800 rounded w-3/4 mb-2 animate-pulse"></div>
              <div class="h-3 bg-neutral-800 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div v-else-if="recentActivity.length === 0" class="text-center py-8">
          <p class="text-neutral-400 text-sm">No recent activity</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start gap-3"
          >
            <div :class="`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.action_type)}`"></div>
            <div class="flex-1">
              <p class="text-sm text-neutral-300">{{ formatActivityDescription(activity) }}</p>
              <p class="text-xs text-neutral-500 mt-1">{{ formatTimeAgo(activity.created_at) }}</p>
            </div>
          </div>
        </div>
        <NuxtLink to="/activity-logs" class="w-full mt-6 btn-secondary text-sm text-center block">View All Activity</NuxtLink>
      </div>
    </div>

    <!-- Quick Actions and Recent Items -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quick Actions -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-white mb-6">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink
            to="/users"
            class="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-primary-500 hover:bg-neutral-800 transition-all group"
          >
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h3 class="font-medium text-white text-sm">Add User</h3>
            <p class="text-xs text-neutral-400 mt-1">Create new account</p>
          </NuxtLink>

          <NuxtLink
            to="/campaigns"
            class="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-brown-500 hover:bg-neutral-800 transition-all group"
          >
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-brown-500/20 rounded-lg group-hover:bg-brown-500/30 transition-colors">
                <svg class="w-5 h-5 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <h3 class="font-medium text-white text-sm">New Campaign</h3>
            <p class="text-xs text-neutral-400 mt-1">Start marketing</p>
          </NuxtLink>

          <NuxtLink
            to="/plans"
            class="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-primary-500 hover:bg-neutral-800 transition-all group"
          >
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h3 class="font-medium text-white text-sm">Create Plan</h3>
            <p class="text-xs text-neutral-400 mt-1">Add subscription</p>
          </NuxtLink>

          <NuxtLink
            to="/fulfillment-tasks"
            class="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 hover:border-yellow-500 hover:bg-neutral-800 transition-all group"
          >
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h3 class="font-medium text-white text-sm">New Task</h3>
            <p class="text-xs text-neutral-400 mt-1">Assign fulfillment</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Subscriptions -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">Recent Subscriptions</h2>
          <NuxtLink to="/subscriptions" class="text-sm text-primary-400 hover:text-primary-300">View All</NuxtLink>
        </div>
        <div v-if="loadingRecent" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-16 bg-neutral-800/50 rounded-lg animate-pulse"></div>
        </div>
        <div v-else-if="recentSubscriptions.length === 0" class="text-center py-8">
          <p class="text-neutral-400 text-sm">No recent subscriptions</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="subscription in recentSubscriptions"
            :key="subscription.id"
            class="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-white">{{ getInitials(subscription.user?.name || 'U') }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ subscription.user?.name || 'Unknown User' }}</p>
                <p class="text-xs text-neutral-400">{{ subscription.plan?.name || 'No Plan' }}</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(subscription.status)">{{ subscription.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = ref<any>(null)
const recentSubscriptions = ref<any[]>([])
const recentActivity = ref<any[]>([])
const loading = ref(false)
const loadingRecent = ref(false)
const loadingActivity = ref(false)
const pendingTasksCount = ref(0)

const { getDashboardStats, getRecentSubscriptions } = useDashboard()
const { getLogs } = useActivityLogs()
const { getTasks } = useFulfillmentTasks()

// Helper functions
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

const getActivityColor = (action: string) => {
  const colors: Record<string, string> = {
    created: 'bg-primary-500',
    updated: 'bg-primary-500',
    deleted: 'bg-red-500',
    status_changed: 'bg-yellow-500',
  }
  return colors[action] || 'bg-neutral-500'
}

const formatActivityDescription = (activity: any) => {
  if (activity.description) {
    return activity.description
  }
  return `${activity.action || 'Activity'} on ${activity.model_type || 'item'}`
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

// Load dashboard data
const loadDashboard = async () => {
  loading.value = true
  
  try {
    const dashboardStats = await getDashboardStats()
    stats.value = dashboardStats
    
    // Load pending tasks count
    try {
      const tasksResponse = await getTasks({ status: 'pending', per_page: 1 })
      pendingTasksCount.value = tasksResponse.meta?.total || 0
    } catch (err) {
      console.error('Error loading pending tasks:', err)
    }
  } catch (err: any) {
    console.error('Error loading dashboard:', err)
  } finally {
    loading.value = false
  }
}

// Load recent subscriptions
const loadRecentSubscriptions = async () => {
  loadingRecent.value = true
  try {
    const subscriptions = await getRecentSubscriptions(3)
    recentSubscriptions.value = subscriptions
  } catch (err) {
    console.error('Error loading recent subscriptions:', err)
  } finally {
    loadingRecent.value = false
  }
}

// Load recent activity
const loadRecentActivity = async () => {
  loadingActivity.value = true
  try {
    const response = await getLogs({ per_page: 4 })
    recentActivity.value = response.data || []
  } catch (err) {
    console.error('Error loading recent activity:', err)
  } finally {
    loadingActivity.value = false
  }
}

onMounted(() => {
  loadDashboard()
  loadRecentSubscriptions()
  loadRecentActivity()
})

useHead({
  title: 'Dashboard - Admin Panel',
  meta: [
    {
      name: 'description',
      content: 'Admin dashboard for managing the subscription-based social media growth platform'
    }
  ]
})
</script>
