<template>
  <div class="min-h-screen bg-neutral-800 flex">
    <AdminSidebar />
    <div class="flex-1 flex flex-col ml-64">
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout with sidebar
</script>
