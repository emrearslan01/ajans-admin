<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Support Tickets</h1>
        <p class="text-neutral-400 mt-1">Manage customer support requests and inquiries</p>
      </div>
      <div class="flex items-center gap-4">
        <select v-model="statusFilter" @change="handleFilterChange" class="input-field">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting">Waiting</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select v-model="categoryFilter" @change="handleFilterChange" class="input-field">
          <option value="">All Categories</option>
          <option value="billing">Billing</option>
          <option value="subscription">Subscription</option>
          <option value="campaign">Campaign</option>
          <option value="technical">Technical</option>
          <option value="account">Account</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-red-500/20 rounded-lg">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Open</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.open || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">Require attention</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-yellow-500/20 rounded-lg">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">In Progress</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.in_progress || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">Being handled</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-primary-500/20 rounded-lg">
            <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Resolved</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.resolved || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">This month</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-neutral-500/20 rounded-lg">
            <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Closed</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.closed || 0 }}</p>
        <p class="text-xs text-neutral-500 mt-2">Total closed</p>
      </div>
    </div>

    <!-- Tickets List -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <p class="text-neutral-400">Loading tickets...</p>
      </div>
      <div v-else-if="tickets.length === 0" class="p-8 text-center">
        <p class="text-neutral-400">No tickets found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-neutral-800/50 border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Ticket</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr 
              v-for="ticket in tickets" 
              :key="ticket.id"
              class="table-row cursor-pointer hover:bg-neutral-800/50 transition-colors"
              @click="router.push(`/tickets/${ticket.id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">#TKT-{{ ticket.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span class="text-xs font-bold text-white">
                      {{ getInitials(ticket.user?.name || 'Unknown') }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ ticket.user?.name || 'Unknown User' }}</div>
                    <div class="text-xs text-neutral-400">{{ ticket.user?.email || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-300">{{ ticket.subject }}</div>
                <div class="text-xs text-neutral-500 mt-1 line-clamp-1">{{ ticket.description || 'No description' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge" :class="getCategoryBadgeClass(ticket.category)">
                  {{ formatCategory(ticket.category) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge" :class="getStatusBadgeClass(ticket.status)">
                  {{ formatStatus(ticket.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                {{ formatTimeAgo(ticket.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-primary-400 hover:text-primary-300" 
                  @click.stop="router.push(`/tickets/${ticket.id}`)"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && tickets.length > 0" class="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
        <div class="text-sm text-neutral-400">
          Showing 
          <span class="text-white font-medium">{{ ((pagination.current_page - 1) * pagination.per_page) + 1 }}</span> 
          to 
          <span class="text-white font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span> 
          of 
          <span class="text-white font-medium">{{ pagination.total }}</span> 
          tickets
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
            v-for="page in getPageNumbers()"
            :key="page"
            @click="changePage(page)"
            :class="page === pagination.current_page ? 'btn-primary text-sm' : 'btn-secondary text-sm'"
          >
            {{ page }}
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
const router = useRouter()
const { getTickets, getStats } = useTickets()

const tickets = ref<any[]>([])
const stats = ref<any>(null)
const loading = ref(false)
const statusFilter = ref('')
const categoryFilter = ref('')
const pagination = ref<any>(null)

const loadTickets = async (page = 1) => {
  loading.value = true
  try {
    const response = await getTickets({
      status: statusFilter.value || undefined,
      category: categoryFilter.value || undefined,
      page,
      per_page: 20,
    })
    tickets.value = response.data
    pagination.value = response.meta
  } catch (err: any) {
    console.error('Error loading tickets:', err)
    alert(err.message || 'Failed to load tickets')
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

const handleFilterChange = () => {
  loadTickets(1)
}

const changePage = (page: number | string) => {
  if (typeof page === 'string') return
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadTickets(page)
  }
}

const getPageNumbers = () => {
  if (!pagination.value) return []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages: number[] = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(last)
    } else if (current >= last - 2) {
      pages.push(1)
      for (let i = last - 4; i <= last; i++) pages.push(i)
    } else {
      pages.push(1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(last)
    }
  }
  
  return pages
}

const getInitials = (name: string) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatCategory = (category: string) => {
  return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'N/A'
}

const formatStatus = (status: string) => {
  return status ? status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'N/A'
}

const getCategoryBadgeClass = (category: string) => {
  const classes: Record<string, string> = {
    billing: 'badge-danger',
    subscription: 'badge-warning',
    campaign: 'badge-info',
    technical: 'badge-primary',
    account: 'badge-success',
    other: 'badge-secondary',
  }
  return classes[category] || 'badge-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    open: 'badge-warning',
    in_progress: 'badge-info',
    waiting: 'badge-warning',
    resolved: 'badge-success',
    closed: 'badge-secondary',
  }
  return classes[status] || 'badge-secondary'
}

const formatTimeAgo = (date: string) => {
  if (!date) return 'N/A'
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return then.toLocaleDateString()
}

onMounted(() => {
  loadTickets()
  loadStats()
})

useHead({
  title: 'Tickets - Admin Panel'
})
</script>
