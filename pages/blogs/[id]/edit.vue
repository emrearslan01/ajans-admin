<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/blogs" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Blogs
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Edit Blog Post</h1>
        <p class="text-neutral-400 mt-1">Update blog post information</p>
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

    <!-- Edit Form -->
    <div v-else-if="blog" class="card p-6">
      <form @submit.prevent="saveBlog" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Title -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Title *</label>
            <input
              v-model="blogForm.title"
              type="text"
              required
              class="input-field w-full"
              placeholder="Enter blog title..."
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Slug</label>
            <input
              v-model="blogForm.slug"
              type="text"
              class="input-field w-full"
              placeholder="Auto-generated from title"
            />
            <p class="text-xs text-neutral-500 mt-1">Leave empty to auto-generate from title</p>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Status *</label>
            <select v-model="blogForm.status" required class="input-field w-full">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <!-- Published At -->
          <div v-if="blogForm.status === 'published'" class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Published At</label>
            <input
              v-model="publishedAtLocal"
              type="datetime-local"
              class="input-field w-full"
            />
            <p class="text-xs text-neutral-500 mt-1">Leave empty to publish now. Current: {{ blogForm.published_at ? formatDate(blogForm.published_at) : 'Not set' }}</p>
          </div>

          <!-- Featured Image -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Featured Image URL</label>
            <input
              v-model="blogForm.featured_image"
              type="url"
              class="input-field w-full"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="blogForm.featured_image" class="mt-4">
              <img :src="blogForm.featured_image" alt="Featured" class="max-w-md h-48 object-cover rounded-lg border border-neutral-800" />
            </div>
          </div>

          <!-- Excerpt -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Excerpt</label>
            <textarea
              v-model="blogForm.excerpt"
              rows="3"
              class="input-field w-full"
              placeholder="Short description/summary of the blog post..."
              maxlength="500"
            ></textarea>
            <p class="text-xs text-neutral-500 mt-1">{{ blogForm.excerpt?.length || 0 }}/500 characters</p>
          </div>

          <!-- Content -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Content *</label>
            <textarea
              v-model="blogForm.content"
              rows="15"
              required
              class="input-field w-full font-mono text-sm"
              placeholder="Write your blog content here... (HTML or Markdown supported)"
            ></textarea>
          </div>

          <!-- SEO Meta Title -->
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">SEO Meta Title</label>
            <input
              v-model="blogForm.meta_title"
              type="text"
              class="input-field w-full"
              placeholder="SEO title (optional)"
              maxlength="255"
            />
          </div>

          <!-- SEO Meta Description -->
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">SEO Meta Description</label>
            <textarea
              v-model="blogForm.meta_description"
              rows="2"
              class="input-field w-full"
              placeholder="SEO description (optional)"
              maxlength="500"
            ></textarea>
          </div>
        </div>

        <div v-if="formError" class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p class="text-red-400 text-sm">{{ formError }}</p>
        </div>

        <div class="flex items-center gap-4 pt-4 border-t border-neutral-800">
          <button type="submit" class="btn-primary flex-1" :disabled="saving">
            {{ saving ? 'Saving Changes...' : 'Save Changes' }}
          </button>
          <NuxtLink :to="`/blogs/${blogId}`" class="btn-secondary">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const blogId = computed(() => route.params.id as string)

const blog = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const saving = ref(false)
const formError = ref<string | null>(null)

const { getBlog, updateBlog } = useBlogs()

const blogForm = ref({
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

const publishedAtLocal = computed({
  get: () => {
    if (!blogForm.value.published_at) return ''
    try {
      const date = new Date(blogForm.value.published_at)
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
        blogForm.value.published_at = new Date(value).toISOString()
      } catch {
        blogForm.value.published_at = ''
      }
    } else {
      blogForm.value.published_at = ''
    }
  }
})

const loadBlog = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getBlog(blogId.value)
    blog.value = response.data
    
    blogForm.value = {
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

const saveBlog = async () => {
  saving.value = true
  formError.value = null

  try {
    const data: any = {
      title: blogForm.value.title,
      excerpt: blogForm.value.excerpt || null,
      content: blogForm.value.content,
      featured_image: blogForm.value.featured_image || null,
      status: blogForm.value.status,
      meta_title: blogForm.value.meta_title || null,
      meta_description: blogForm.value.meta_description || null,
    }

    if (blogForm.value.slug) {
      data.slug = blogForm.value.slug
    }

    // Set published_at if status is published and published_at is not set
    if (blogForm.value.status === 'published') {
      if (blogForm.value.published_at) {
        data.published_at = blogForm.value.published_at
      } else if (!blog.value.published_at) {
        // If changing to published and no published_at set, set it to now
        data.published_at = new Date().toISOString()
      }
    }

    await updateBlog(blogId.value, data)
    await router.push(`/blogs/${blogId.value}`)
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
  title: `Edit Blog ${blogId.value} - Admin Panel`
})
</script>
