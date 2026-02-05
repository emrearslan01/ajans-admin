<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Blogs</h1>
        <p class="text-neutral-400 mt-1">Manage blog posts and articles</p>
      </div>
      <NuxtLink to="/blogs/create" class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Blog
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Total</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.total || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Published</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.published || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Draft</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.draft || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Total Views</h3>
        <p class="text-3xl font-bold text-white">{{ stats?.total_views || 0 }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search blogs..."
          class="input-field flex-1 min-w-[200px]"
          @input="debouncedSearch"
        />
        <select v-model="statusFilter" class="input-field" @change="loadBlogs">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button @click="loadBlogs" class="btn-secondary">Filter</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading blogs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadBlogs" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Blogs List -->
    <div v-else class="card overflow-hidden">
      <div v-if="blogs.length === 0" class="text-center py-12">
        <p class="text-neutral-400">No blogs found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-neutral-800/50 border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Views</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Published</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr
              v-for="blog in blogs"
              :key="blog.id"
              class="hover:bg-neutral-800/30 transition-colors"
            >
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-white">{{ blog.title }}</div>
                  <div class="text-xs text-neutral-500 mt-1">{{ blog.slug }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadgeClass(blog.status)">{{ blog.status }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="badge badge-info">{{ blog.views || 0 }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-400">{{ formatDate(blog.published_at) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <NuxtLink 
                    :to="`/blogs/${blog.id}`" 
                    class="text-primary-400 hover:text-primary-300 text-sm font-medium"
                  >
                    View
                  </NuxtLink>
           
                   
                
                  <button
                    @click="deleteBlog(blog.id)"
                    class="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination" class="px-6 py-4 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-4">
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
          
          <div class="flex items-center gap-1">
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              @click="typeof page === 'number' ? changePage(page) : null"
              :disabled="typeof page === 'string'"
              :class="[
                'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors',
                typeof page === 'string'
                  ? 'text-neutral-500 cursor-default'
                  : page === pagination.current_page
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
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
const blogs = ref<any[]>([])
const stats = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const pagination = ref<any>(null)

const { getBlogs, getStats, deleteBlog: deleteBlogApi } = useBlogs()

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    published: 'badge badge-success',
    draft: 'badge badge-warning',
    archived: 'badge badge-danger',
  }
  return classes[status] || 'badge badge-info'
}

const formatDate = (date: string) => {
  if (!date) return 'Not published'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadBlogs = async (page = 1) => {
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
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    const response = await getBlogs(params)
    blogs.value = response.data
    pagination.value = response.meta
  } catch (err: any) {
    error.value = err.message || 'Failed to load blogs'
    console.error('Error loading blogs:', err)
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
    loadBlogs(page)
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getPageNumbers = () => {
  if (!pagination.value) return []
  
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages: (number | string)[] = []
  
  if (last <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    // Show first page
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < last - 2) {
      pages.push('...')
    }
    
    // Show last page
    pages.push(last)
  }
  
  return pages.filter((p, i, arr) => {
    if (p === '...') return true
    return arr.indexOf(p) === i
  })
}

const deleteBlog = async (id: number) => {
  if (!confirm('Are you sure you want to delete this blog post?')) {
    return
  }
  
  try {
    await deleteBlogApi(id)
    await loadBlogs(pagination.value?.current_page || 1)
    await loadStats()
  } catch (err: any) {
    alert(err.message || 'Failed to delete blog')
    console.error('Error deleting blog:', err)
  }
}

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadBlogs(1)
  }, 500)
}

onMounted(() => {
  loadStats()
  loadBlogs()
})

useHead({
  title: 'Blogs - Admin Panel'
})
</script>
