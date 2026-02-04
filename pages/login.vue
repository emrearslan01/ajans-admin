<template>
  <div class="min-h-screen bg-neutral-800 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2">
          NovusDV
        </h1>
        <p class="text-neutral-400">Admin Panel</p>
      </div>

      <!-- Login Card -->
      <div class="card p-8">
        <h2 class="text-2xl font-bold text-white mb-2">Login</h2>
        <p class="text-neutral-400 mb-6">Enter your credentials to access the admin panel</p>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input-field w-full"
              placeholder="admin@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-300 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input-field w-full"
              placeholder="Enter your password"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full mt-6"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
            <span v-else>Login</span>
          </button>
        </form>

        <!-- Info -->

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { login } = useAuth()

const email = ref('admin@example.com')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await login(email.value, password.value)
    
    // Check if user is admin
    if (response.user?.is_admin) {
      // Redirect to dashboard
      await router.push('/')
    } else {
      error.value = 'Access denied. Admin privileges required.'
      // Logout if not admin
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Invalid email or password'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(async () => {
  const { isAuthenticated, me } = useAuth()
  try {
    await me()
    if (isAuthenticated.value) {
      await router.push('/')
    }
  } catch {
    // Not logged in, stay on login page
  }
})

definePageMeta({
  layout: false
})

useHead({
  title: 'Login - Admin Panel'
})
</script>
