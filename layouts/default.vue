<template>
  <div class="min-h-screen bg-neutral-800 flex">
    <AdminSidebar />
    <div class="flex-1 flex flex-col ml-64">
      <AdminHeader :title="pageTitle" :subtitle="pageSubtitle" />
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview and statistics' },
  '/users': { title: 'Users', subtitle: 'Manage users and accounts' },
  '/subscriptions': { title: 'Subscriptions', subtitle: 'View and manage subscriptions' },
  '/campaigns': { title: 'Campaigns', subtitle: 'Manage marketing campaigns' },
  '/plans': { title: 'Plans', subtitle: 'Manage subscription plans' },
  '/fulfillment-tasks': { title: 'Fulfillment Tasks', subtitle: 'Manage fulfillment tasks' },
  '/tickets': { title: 'Tickets', subtitle: 'Manage support tickets' },
  '/activity-logs': { title: 'Activity Logs', subtitle: 'View system activity logs' }
}

const currentPage = pageTitles[route.path] || { title: 'Admin Panel', subtitle: '' }
const pageTitle = computed(() => currentPage.title)
const pageSubtitle = computed(() => currentPage.subtitle)
</script>
