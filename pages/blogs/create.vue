<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/blogs" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Blogs
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Create Blog Post</h1>
        <p class="text-neutral-400 mt-1">Create a new blog post</p>
      </div>
    </div>

    <div class="card p-6">
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
          <div v-if="blogForm.status === 'published'">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Published At</label>
            <input
              v-model="blogForm.published_at"
              type="datetime-local"
              class="input-field w-full"
            />
            <p class="text-xs text-neutral-500 mt-1">Leave empty to publish now</p>
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
            {{ saving ? 'Creating...' : 'Create Blog Post' }}
          </button>
          <NuxtLink to="/blogs" class="btn-secondary">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { createBlog } = useBlogs()

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

const saving = ref(false)
const formError = ref<string | null>(null)

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

    if (blogForm.value.published_at) {
      data.published_at = blogForm.value.published_at
    }

    const response = await createBlog(data)
    await router.push(`/blogs/${response.data.id}`)
  } catch (err: any) {
    formError.value = err.message || 'Failed to create blog post'
    console.error('Error creating blog:', err)
  } finally {
    saving.value = false
  }
}

useHead({
  title: 'Create Blog - Admin Panel'
})
</script>
