<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/blogs" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Blogs
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Blog Details</h1>
        <p class="text-neutral-400 mt-1">View blog post information</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="toggleEditMode"
          class="btn-primary"
        >
          {{ isEditMode ? 'Cancel Edit' : 'Edit Blog' }}
        </button>
        <button 
          v-if="isEditMode"
          @click="saveChanges"
          class="btn-primary"
          :disabled="saving"
        >
          {{ saving ? 'Saving Changes...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading blog...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadBlog" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Blog Details -->
    <div v-else-if="blog" class="space-y-6">
      <!-- Main Info Card -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <div v-if="!isEditMode">
              <h2 class="text-2xl font-bold text-white mb-2">{{ blog.title }}</h2>
              <p class="text-sm text-neutral-400">Slug: {{ blog.slug }}</p>
            </div>
            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-300 mb-2">Title *</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  required
                  class="input-field w-full"
                  placeholder="Enter blog title..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-300 mb-2">Slug</label>
                <input
                  v-model="editForm.slug"
                  type="text"
                  class="input-field w-full"
                  placeholder="Auto-generated from title"
                />
              </div>
            </div>
          </div>
          <div v-if="!isEditMode">
            <span :class="getStatusBadgeClass(blog.status)">{{ blog.status }}</span>
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Status *</label>
            <select v-model="editForm.status" required class="input-field">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div v-if="blog.featured_image || isEditMode" class="mb-6">
          <div v-if="!isEditMode && blog.featured_image">
            <img :src="blog.featured_image" alt="Featured" class="w-full max-w-2xl h-64 object-cover rounded-lg border border-neutral-800" />
          </div>
          <div v-if="isEditMode">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Featured Image URL</label>
            <input
              v-model="editForm.featured_image"
              type="url"
              class="input-field w-full"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="editForm.featured_image" class="mt-4">
              <img :src="editForm.featured_image" alt="Featured" class="max-w-md h-48 object-cover rounded-lg border border-neutral-800" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="!isEditMode">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Views</label>
            <span class="badge badge-info">{{ blog.views || 0 }} views</span>
          </div>

          <div v-if="!isEditMode">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Published At</label>
            <div class="text-white">{{ formatDate(blog.published_at) }}</div>
          </div>

          <div v-if="isEditMode && editForm.status === 'published'" class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Published At</label>
            <input
              v-model="publishedAtLocal"
              type="datetime-local"
              class="input-field w-full"
            />
          </div>

          <div v-if="blog.created_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Created At</label>
            <div class="text-white">{{ formatDate(blog.created_at) }}</div>
          </div>

          <div v-if="blog.updated_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Last Updated</label>
            <div class="text-white">{{ formatDate(blog.updated_at) }}</div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-neutral-800">
          <label class="block text-sm font-medium text-neutral-400 mb-2">Excerpt</label>
          <div v-if="!isEditMode" class="text-white bg-neutral-800/50 p-4 rounded-lg">
            {{ blog.excerpt || 'No excerpt' }}
          </div>
          <textarea
            v-else
            v-model="editForm.excerpt"
            rows="3"
            class="input-field w-full"
            placeholder="Short description/summary of the blog post..."
            maxlength="500"
          ></textarea>
          <p v-if="isEditMode" class="text-xs text-neutral-500 mt-1">{{ editForm.excerpt?.length || 0 }}/500 characters</p>
        </div>

        <div class="mt-6 pt-6 border-t border-neutral-800">
          <label class="block text-sm font-medium text-neutral-400 mb-2">Content *</label>
          <div v-if="!isEditMode" class="text-white bg-neutral-800/50 p-6 rounded-lg prose prose-invert max-w-none">
            <div v-html="formatContent(blog.content)"></div>
          </div>
          <textarea
            v-else
            v-model="editForm.content"
            rows="15"
            required
            class="input-field w-full font-mono text-sm"
            placeholder="Write your blog content here... (HTML or Markdown supported)"
          ></textarea>
        </div>

        <div class="mt-6 pt-6 border-t border-neutral-800">
          <h3 class="text-lg font-bold text-white mb-4">SEO Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-400 mb-2">Meta Title</label>
              <div v-if="!isEditMode" class="text-white">{{ blog.meta_title || 'Not set' }}</div>
              <input
                v-else
                v-model="editForm.meta_title"
                type="text"
                class="input-field w-full"
                placeholder="SEO title (optional)"
                maxlength="255"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-400 mb-2">Meta Description</label>
              <div v-if="!isEditMode" class="text-white">{{ blog.meta_description || 'Not set' }}</div>
              <textarea
                v-else
                v-model="editForm.meta_description"
                rows="2"
                class="input-field w-full"
                placeholder="SEO description (optional)"
                maxlength="500"
              ></textarea>
            </div>
          </div>
        </div>

        <div v-if="formError" class="mt-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p class="text-red-400 text-sm">{{ formError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const blogId = computed(() => route.params.id as string)

const blog = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isEditMode = ref(false)
const saving = ref(false)
const formError = ref<string | null>(null)

const { getBlog, updateBlog } = useBlogs()

const editForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image: '',
  status: 'draft',
  published_at: '',
  meta_title: '',
  meta_description: '',
})

const publishedAtLocal = computed({
  get: () => {
    if (!editForm.value.published_at) return ''
    try {
      const date = new Date(editForm.value.published_at)
      if (isNaN(date.getTime())) return ''
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
      return ''
    }
  },
  set: (value: string) => {
    if (value) {
      try {
        editForm.value.published_at = new Date(value).toISOString()
      } catch {
        editForm.value.published_at = ''
      }
    } else {
      editForm.value.published_at = ''
    }
  }
})

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    published: 'badge badge-success',
    draft: 'badge badge-warning',
    archived: 'badge badge-danger',
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

const formatContent = (content: string) => {
  if (!content) return ''
  // Simple formatting - in production, you might want to use a markdown parser
  return content.replace(/\n/g, '<br>')
}

const loadBlog = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getBlog(blogId.value)
    blog.value = response.data
    
    // Initialize edit form
    editForm.value = {
      title: blog.value.title || '',
      slug: blog.value.slug || '',
      excerpt: blog.value.excerpt || '',
      content: blog.value.content || '',
      featured_image: blog.value.featured_image || '',
      status: blog.value.status || 'draft',
      published_at: blog.value.published_at || '',
      meta_title: blog.value.meta_title || '',
      meta_description: blog.value.meta_description || '',
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load blog'
    console.error('Error loading blog:', err)
  } finally {
    loading.value = false
  }
}

const toggleEditMode = () => {
  if (isEditMode.value) {
    // Cancel edit - reload original data
    if (blog.value) {
      editForm.value = {
        title: blog.value.title || '',
        slug: blog.value.slug || '',
        excerpt: blog.value.excerpt || '',
        content: blog.value.content || '',
        featured_image: blog.value.featured_image || '',
        status: blog.value.status || 'draft',
        published_at: blog.value.published_at || '',
        meta_title: blog.value.meta_title || '',
        meta_description: blog.value.meta_description || '',
      }
    }
    formError.value = null
  }
  isEditMode.value = !isEditMode.value
}

const saveChanges = async () => {
  saving.value = true
  formError.value = null

  try {
    const data: any = {
      title: editForm.value.title,
      excerpt: editForm.value.excerpt || null,
      content: editForm.value.content,
      featured_image: editForm.value.featured_image || null,
      status: editForm.value.status,
      meta_title: editForm.value.meta_title || null,
      meta_description: editForm.value.meta_description || null,
    }

    if (editForm.value.slug) {
      data.slug = editForm.value.slug
    }

    // Set published_at if status is published
    if (editForm.value.status === 'published') {
      if (editForm.value.published_at) {
        data.published_at = editForm.value.published_at
      } else if (!blog.value.published_at) {
        data.published_at = new Date().toISOString()
      }
    }

    await updateBlog(blogId.value, data)
    await loadBlog() // Reload to get updated data
    isEditMode.value = false
  } catch (err: any) {
    formError.value = err.message || 'Failed to update blog post'
    console.error('Error updating blog:', err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadBlog()
})

useHead({
  title: `Blog ${blogId.value} - Admin Panel`
})
</script>
