<template>
  <div class="fixed top-6 right-6 z-50">
    <div class="relative" ref="menuRef">
      <!-- User Avatar Button -->
      <button
        @click="toggleMenu"
        class="flex items-center gap-3 px-4 py-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-full hover:bg-neutral-900 hover:border-primary-500/50 transition-all shadow-lg hover:shadow-primary-500/20 cursor-pointer"
      >
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
          <p class="text-xs text-neutral-400">{{ user?.email || 'Administrator' }}</p>
        </div>
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-glow ring-2 ring-primary-500/30">
          <span class="text-sm font-bold text-white">{{ user?.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
        </div>
        <svg 
          class="w-4 h-4 text-neutral-400 transition-transform"
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
          class="absolute right-0 mt-2 w-56 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
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
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = async () => {
  await logout()
  isOpen.value = false
}

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
