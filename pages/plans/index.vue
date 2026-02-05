<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Subscription Plans</h1>
        <p class="text-neutral-400 mt-1">Manage pricing plans and features</p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="showCreateModal = true">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Plan
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading plans...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadPlans" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Plans by Platform -->
    <div v-else class="space-y-8">
      <!-- Instagram Plans -->
      <div v-if="groupedPlans.instagram.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-pink-500/20 rounded-lg">
            <svg class="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">Instagram Plans</h2>
          <span class="badge badge-info">{{ groupedPlans.instagram.length }} plans</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="plan in groupedPlans.instagram"
            :key="plan.id"
            class="card p-6 border-2 border-neutral-800 hover:border-pink-500 transition-colors"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ plan.name }}</h3>
              <span v-if="plan.tier" class="badge badge-info text-xs">{{ plan.tier.replace('instagram-', '') }}</span>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-bold text-white">${{ parseFloat(plan.price || 0).toFixed(2) }}</span>
              <span class="text-neutral-400">/month</span>
            </div>
            <div class="mb-6">
              <p class="text-neutral-300 text-sm">{{ plan.description || 'No description' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink 
                :to="`/plans/${plan.id}`" 
                class="flex-1 btn-secondary text-center"
              >
                View
              </NuxtLink>
              <button @click="editPlan(plan)" class="btn-secondary">Edit</button>
              <button @click="deletePlan(plan.id)" class="btn-secondary text-red-400 hover:text-red-300">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TikTok Plans -->
      <div v-if="groupedPlans.tiktok.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-neutral-900 rounded-lg border border-neutral-700">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">TikTok Plans</h2>
          <span class="badge badge-info">{{ groupedPlans.tiktok.length }} plans</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="plan in groupedPlans.tiktok"
            :key="plan.id"
            class="card p-6 border-2 border-neutral-800 hover:border-neutral-600 transition-colors"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ plan.name }}</h3>
              <span v-if="plan.tier" class="badge badge-info text-xs">{{ plan.tier.replace('tiktok-', '') }}</span>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-bold text-white">${{ parseFloat(plan.price || 0).toFixed(2) }}</span>
              <span class="text-neutral-400">/month</span>
            </div>
            <div class="mb-6">
              <p class="text-neutral-300 text-sm">{{ plan.description || 'No description' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink 
                :to="`/plans/${plan.id}`" 
                class="flex-1 btn-secondary text-center"
              >
                View
              </NuxtLink>
              <button @click="editPlan(plan)" class="btn-secondary">Edit</button>
              <button @click="deletePlan(plan.id)" class="btn-secondary text-red-400 hover:text-red-300">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Plans -->
      <div v-if="groupedPlans.other.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-neutral-500/20 rounded-lg">
            <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">Other Plans</h2>
          <span class="badge badge-info">{{ groupedPlans.other.length }} plans</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="plan in groupedPlans.other"
            :key="plan.id"
            class="card p-6 border-2 border-neutral-800 hover:border-primary-500 transition-colors"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ plan.name }}</h3>
              <span v-if="plan.tier" class="badge badge-info">{{ plan.tier }}</span>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-bold text-white">${{ parseFloat(plan.price || 0).toFixed(2) }}</span>
              <span class="text-neutral-400">/month</span>
            </div>
            <div class="mb-6">
              <p class="text-neutral-300 text-sm">{{ plan.description || 'No description' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink 
                :to="`/plans/${plan.id}`" 
                class="flex-1 btn-secondary text-center"
              >
                View
              </NuxtLink>
              <button @click="editPlan(plan)" class="btn-secondary">Edit</button>
              <button @click="deletePlan(plan.id)" class="btn-secondary text-red-400 hover:text-red-300">Delete</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="plans.length === 0" class="text-center py-12">
        <p class="text-neutral-400">No plans found. Create your first plan!</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingPlan"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="card p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">
            {{ editingPlan ? 'Edit Plan' : 'Create New Plan' }}
          </h2>
          <button @click="closeModal" class="text-neutral-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePlan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Plan Name *</label>
            <input
              v-model="planForm.name"
              type="text"
              required
              class="input-field w-full"
              placeholder="e.g., Basic Plan"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Price (USD) *</label>
            <input
              v-model.number="planForm.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="input-field w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Tier *</label>
            <input
              v-model="planForm.tier"
              type="text"
              required
              class="input-field w-full"
              placeholder="e.g., instagram-basic, tiktok-premium"
            />
            <p class="text-xs text-neutral-500 mt-1">Format: platform-tier (e.g., instagram-basic)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Description</label>
            <textarea
              v-model="planForm.description"
              rows="3"
              class="input-field w-full"
              placeholder="Plan description..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Featured Content Credits</label>
            <input
              v-model.number="planForm.featured_content_credits"
              type="number"
              min="0"
              class="input-field w-full"
              placeholder="0"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Stripe Payment Link</label>
            <input
              v-model="planForm.stripe_payment_link"
              type="url"
              class="input-field w-full"
              placeholder="https://buy.stripe.com/..."
            />
          </div>

          <div v-if="formError" class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p class="text-red-400 text-sm">{{ formError }}</p>
          </div>

          <div class="flex items-center gap-4 pt-4">
            <button type="submit" class="btn-primary flex-1" :disabled="saving">
              {{ saving ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const plans = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)
const editingPlan = ref<any>(null)
const saving = ref(false)
const formError = ref<string | null>(null)

const planForm = ref({
  name: '',
  price: 0,
  tier: '',
  description: '',
  featured_content_credits: 0,
  stripe_payment_link: '',
})

const { getAdminPlans, createPlan: createPlanApi, updatePlan: updatePlanApi, deletePlan: deletePlanApi } = usePlans()

// Group plans by platform
const groupedPlans = computed(() => {
  const grouped: { instagram: any[], tiktok: any[], other: any[] } = {
    instagram: [],
    tiktok: [],
    other: []
  }
  
  plans.value.forEach(plan => {
    const tier = (plan.tier || '').toLowerCase()
    if (tier.startsWith('instagram')) {
      grouped.instagram.push(plan)
    } else if (tier.startsWith('tiktok')) {
      grouped.tiktok.push(plan)
    } else {
      grouped.other.push(plan)
    }
  })
  
  return grouped
})

const loadPlans = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getAdminPlans()
    plans.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to load plans'
    console.error('Error loading plans:', err)
  } finally {
    loading.value = false
  }
}

const editPlan = (plan: any) => {
  editingPlan.value = plan
  planForm.value = {
    name: plan.name || '',
    price: plan.price || 0,
    tier: plan.tier || '',
    description: plan.description || '',
    featured_content_credits: plan.featured_content_credits || 0,
    stripe_payment_link: plan.stripe_payment_link || '',
  }
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingPlan.value = null
  formError.value = null
  planForm.value = {
    name: '',
    price: 0,
    tier: '',
    description: '',
    featured_content_credits: 0,
    stripe_payment_link: '',
  }
}

const savePlan = async () => {
  saving.value = true
  formError.value = null

  try {
    if (editingPlan.value) {
      await updatePlanApi(editingPlan.value.id, planForm.value)
    } else {
      await createPlanApi(planForm.value)
    }
    await loadPlans()
    closeModal()
  } catch (err: any) {
    formError.value = err.message || 'Failed to save plan'
    console.error('Error saving plan:', err)
  } finally {
    saving.value = false
  }
}

const deletePlan = async (id: number) => {
  if (!confirm('Are you sure you want to delete this plan?')) {
    return
  }
  
  try {
    await deletePlanApi(id)
    await loadPlans()
  } catch (err: any) {
    alert(err.message || 'Failed to delete plan')
    console.error('Error deleting plan:', err)
  }
}

onMounted(() => {
  loadPlans()
})

useHead({
  title: 'Plans - Admin Panel'
})
</script>
