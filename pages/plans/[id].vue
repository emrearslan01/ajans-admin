<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/plans" class="text-primary-400 hover:text-primary-300 text-sm mb-2 inline-block">
          ← Back to Plans
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Plan Details</h1>
        <p class="text-neutral-400 mt-1">View and manage plan information</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-neutral-400 mt-4">Loading plan...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
        <button @click="loadPlan" class="btn-secondary mt-4">Retry</button>
      </div>
    </div>

    <!-- Plan Details -->
    <div v-else-if="plan" class="space-y-6">
      <!-- Main Info Card -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-white">{{ plan.name || 'N/A' }}</h2>
            <p class="text-sm text-neutral-400 mt-1">Plan ID: {{ plan.id }}</p>
          </div>
          <div>
            <span v-if="plan.tier" class="badge badge-info">{{ plan.tier }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Plan Name</label>
            <div class="text-white font-medium">{{ plan.name || 'N/A' }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Price</label>
            <div class="text-white font-medium text-2xl">${{ parseFloat(plan.price || 0).toFixed(2) }}</div>
            <div class="text-sm text-neutral-400">per month</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Tier</label>
            <span class="badge badge-info">{{ plan.tier || 'N/A' }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Featured Content Credits</label>
            <div class="text-white font-medium">{{ plan.featured_content_credits || 0 }} credits</div>
          </div>

          <div v-if="plan.stripe_payment_link" class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Stripe Payment Link</label>
            <a 
              :href="plan.stripe_payment_link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-primary-400 hover:text-primary-300 break-all"
            >
              {{ plan.stripe_payment_link }}
            </a>
          </div>

          <div v-if="plan.description" class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Description</label>
            <div class="text-white bg-neutral-800/50 p-4 rounded-lg">
              {{ plan.description }}
            </div>
          </div>

          <div v-if="plan.created_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Created At</label>
            <div class="text-white">{{ formatDate(plan.created_at) }}</div>
          </div>

          <div v-if="plan.updated_at">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Last Updated</label>
            <div class="text-white">{{ formatDate(plan.updated_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const planId = computed(() => route.params.id as string)

const plan = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const { getPlan } = usePlans()

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

const loadPlan = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await getPlan(planId.value)
    plan.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to load plan'
    console.error('Error loading plan:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPlan()
})

useHead({
  title: `Plan ${planId.value} - Admin Panel`
})
</script>
