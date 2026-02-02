<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col z-50">
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
        <span class="ml-auto px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">12</span>
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

    <!-- Footer -->
    <div class="p-4 border-t border-neutral-800">
      <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-900/50">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-glow">
          <span class="text-xs font-bold text-white">A</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">Admin User</p>
          <p class="text-xs text-neutral-400 truncate">admin@novusdv.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Sidebar component
</script>
