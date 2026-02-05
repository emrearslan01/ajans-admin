<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col z-50">
    <!-- Logo -->
    <div class="p-6 border-b border-neutral-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-glow">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold font-display gradient-text">NovusDV</h1>
          <p class="text-xs text-neutral-400">Admin Panel</p>
        </div>
      </div>
    </div>

    <!-- Digital Clock -->
    <div class="px-6 py-4 border-b border-neutral-800">
      <div class="px-4 py-4 rounded-lg bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 border border-neutral-800/50 backdrop-blur-sm">
        <div class="flex flex-col items-center justify-center space-y-1">
          <div class="text-2xl font-mono font-bold text-primary-400 tabular-nums">
            {{ currentTime }}
          </div>
          <div class="text-xs text-neutral-400 font-medium">
            {{ currentDate }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-4 space-y-1">
      <NuxtLink
        to="/"
        class="sidebar-link"
        :class="{ active: $route.path === '/' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Dashboard</span>
      </NuxtLink>

      <NuxtLink
        to="/users"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/users') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>Users</span>
      </NuxtLink>

      <NuxtLink
        to="/subscriptions"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/subscriptions') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Subscriptions</span>
      </NuxtLink>

      <NuxtLink
        to="/campaigns"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/campaigns') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <span>Campaigns</span>
      </NuxtLink>

      <NuxtLink
        to="/content-boosts"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/content-boosts') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Content Boosts</span>
        <span 
          v-if="pendingBoostsCount > 0"
          class="ml-auto px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full"
        >
          {{ pendingBoostsCount }}
        </span>
      </NuxtLink>

      <NuxtLink
        to="/plans"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/plans') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span>Plans</span>
      </NuxtLink>

      <NuxtLink
        to="/blogs"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/blogs') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Blogs</span>
      </NuxtLink>

      <NuxtLink
        to="/fulfillment-tasks"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/fulfillment-tasks') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span>Fulfillment Tasks</span>
      </NuxtLink>

      <NuxtLink
        to="/tickets"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/tickets') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span>Tickets</span>
        <span 
          v-if="openTicketsCount > 0"
          class="ml-auto px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full"
        >
          {{ openTicketsCount }}
        </span>
      </NuxtLink>

      <NuxtLink
        to="/activity-logs"
        class="sidebar-link"
        :class="{ active: $route.path.startsWith('/activity-logs') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Activity Logs</span>
      </NuxtLink>
    </nav>

    <!-- Footer - User Menu -->
    <div class="p-4 border-t border-neutral-800">
      <!-- User Menu -->
      <div class="relative" ref="menuRef">
        <button
          @click="toggleMenu"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-800 hover:bg-neutral-800 hover:border-primary-500/50 transition-all cursor-pointer"
        >
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-glow ring-2 ring-primary-500/30 flex-shrink-0">
            <span class="text-sm font-bold text-white">{{ user?.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
          </div>
          <div class="flex-1 min-w-0 text-left">
            <p class="text-sm font-medium text-white truncate">{{ user?.name || 'Admin User' }}</p>
            <p class="text-xs text-neutral-400 truncate">{{ user?.email || 'Administrator' }}</p>
          </div>
          <svg 
            class="w-4 h-4 text-neutral-400 transition-transform flex-shrink-0"
            :class="{ 'rotate-180': isOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div 
            v-if="isOpen"
            class="absolute bottom-full left-0 right-0 mb-2 w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
          >
            <div class="py-2">
              <div class="px-4 py-3 border-b border-neutral-800 bg-neutral-800/50">
                <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
                <p class="text-xs text-neutral-400 mt-0.5">{{ user?.email || 'admin@example.com' }}</p>
              </div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 group/item"
              >
                <svg class="w-4 h-4 group-hover/item:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const { getStats } = useTickets()
const { getStats: getContentBoostStats } = useContentBoosts()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const currentTime = ref('')
const currentDate = ref('')
const openTicketsCount = ref(0)
const pendingBoostsCount = ref(0)

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayName = days[now.getDay()]
  const month = months[now.getMonth()]
  const day = now.getDate()
  currentDate.value = `${dayName}, ${month} ${day}`
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = async () => {
  await logout()
  isOpen.value = false
}

// Load ticket stats
const loadTicketStats = async () => {
  try {
    const response = await getStats()
    openTicketsCount.value = response.data?.open || 0
  } catch (err) {
    console.error('Error loading ticket stats:', err)
    openTicketsCount.value = 0
  }
}

// Load content boost stats
const loadContentBoostStats = async () => {
  try {
    const response = await getContentBoostStats()
    pendingBoostsCount.value = response.data?.pending || 0
  } catch (err) {
    console.error('Error loading content boost stats:', err)
    pendingBoostsCount.value = 0
  }
}

// Intervals
let timeInterval: NodeJS.Timeout | null = null
let ticketInterval: NodeJS.Timeout | null = null
let boostInterval: NodeJS.Timeout | null = null

// Close menu when clicking outside
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  loadTicketStats()
  loadContentBoostStats()
  
  // Refresh ticket count every 30 seconds
  ticketInterval = setInterval(loadTicketStats, 30000)
  // Refresh content boost count every 30 seconds
  boostInterval = setInterval(loadContentBoostStats, 30000)
  
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval)
    if (ticketInterval) clearInterval(ticketInterval)
    if (boostInterval) clearInterval(boostInterval)
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
