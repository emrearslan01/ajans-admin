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

    <!-- Plans Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="plan in plans"
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
          <button @click="editPlan(plan)" class="flex-1 btn-secondary">Edit Plan</button>
          <button @click="deletePlan(plan.id)" class="btn-secondary text-red-400 hover:text-red-300">Delete</button>
        </div>
      </div>
      
      <div v-if="plans.length === 0" class="col-span-3 text-center py-12">
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
