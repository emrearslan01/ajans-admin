<template>
  <div class="p-6">
    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          class="input-field flex-1 min-w-[200px]"
          @input="debouncedSearch"
        />
        <select v-model="statusFilter" class="input-field" @change="loadUsers">
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <select v-model="adminFilter" class="input-field" @change="loadUsers">
          <option value="">All Users</option>
          <option value="true">Admins</option>
          <option value="false">Regular Users</option>
        </select>
        <button @click="loadUsers" class="btn-secondary">Filter</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadUsers" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-neutral-800/50 border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Subscriptions</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Campaigns</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Joined</th>

            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr v-if="users.length === 0" class="table-row">
              <td colspan="7" class="px-6 py-8 text-center text-neutral-400">
                No users found
              </td>
            </tr>
            <tr
              v-for="user in users"
              :key="user.id"
              class="table-row"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold text-white">{{ getInitials(user.name) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ user.name }}</div>
                    <div v-if="user.is_admin" class="text-xs text-primary-400">Admin</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-neutral-300">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-info">{{ user.subscriptions_count || 0 }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-info">{{ user.campaigns_count || 0 }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.email_verified_at" class="badge badge-success">Verified</span>
                <span v-else class="badge badge-warning">Unverified</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                {{ formatDate(user.created_at) }}
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
const users = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const adminFilter = ref('')
const pagination = ref<any>(null)

const { getUsers } = useUsers()

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

const getPageNumbers = () => {
  if (!pagination.value) return []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages: number[] = []
  
  if (last <= 5) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= last - 2) {
      for (let i = last - 4; i <= last; i++) {
        pages.push(i)
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
}

// Load users
const loadUsers = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params: any = {
      per_page: 15,
      page,
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (statusFilter.value === 'verified') {
      params.verified = true
    } else if (statusFilter.value === 'unverified') {
      params.verified = false
    }
    
    if (adminFilter.value !== '') {
      params.is_admin = adminFilter.value === 'true'
    }
    
    const response = await getUsers(params)
    users.value = response.data
    pagination.value = response.meta
  } catch (err: any) {
    error.value = err.message || 'Failed to load users'
    console.error('Error loading users:', err)
  } finally {
    loading.value = false
  }
}

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadUsers(1)
  }, 500)
}

// Change page
const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadUsers(page)
  }
}

// Load users on mount
onMounted(() => {
  loadUsers()
})

useHead({
  title: 'Users - Admin Panel'
})
</script>
