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
  </div>
</template>

<script setup lang="ts">
const plans = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)

const { getPlans, deletePlan: deletePlanApi } = usePlans()

const loadPlans = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getPlans()
    plans.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to load plans'
    console.error('Error loading plans:', err)
  } finally {
    loading.value = false
  }
}

const editPlan = (plan: any) => {
  // TODO: Open edit modal
  console.log('Edit plan:', plan)
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
