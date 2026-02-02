<template>
  <header class="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Page Title -->
      <div>
        <h1 class="text-xl font-semibold text-white">{{ title }}</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ subtitle }}</p>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-4">
        <!-- Search -->
        <div class="hidden md:flex items-center gap-2 bg-neutral-900 rounded-lg px-4 py-2 border border-neutral-800">
          <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="bg-transparent border-none outline-none text-neutral-300 placeholder-neutral-500 w-64"
          />
        </div>

        <!-- Notifications -->
        <button class="relative p-2 rounded-lg hover:bg-neutral-800 transition-colors">
          <svg class="w-6 h-6 text-neutral-400 hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        <!-- Settings -->
        <button class="p-2 rounded-lg hover:bg-[#c9c9c9] transition-colors">
          <svg class="w-6 h-6 text-neutral-400 hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <!-- User Menu -->
        <div class="flex items-center gap-3 pl-4 border-l border-neutral-800">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
            <p class="text-xs text-neutral-400">{{ user?.email || 'Administrator' }}</p>
          </div>
          <div class="relative group">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 ring-primary-500/50 transition-all shadow-glow">
              <span class="text-sm font-bold text-white">{{ user?.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
            </div>
            
            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="py-2">
                <div class="px-4 py-2 border-b border-neutral-800">
                  <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
                  <p class="text-xs text-neutral-400">{{ user?.email || 'admin@example.com' }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Dashboard',
  subtitle: 'Overview and statistics'
})

const handleLogout = async () => {
  await logout()
}
</script>
