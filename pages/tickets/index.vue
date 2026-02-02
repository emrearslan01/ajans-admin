<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Support Tickets</h1>
        <p class="text-neutral-400 mt-1">Manage customer support requests and inquiries</p>
      </div>
      <div class="flex items-center gap-4">
        <select class="input-field">
          <option>All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <select class="input-field">
          <option>All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Urgent</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-red-500/20 rounded-lg">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Open</h3>
        <p class="text-3xl font-bold text-white">24</p>
        <p class="text-xs text-neutral-500 mt-2">Require attention</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-yellow-500/20 rounded-lg">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">In Progress</h3>
        <p class="text-3xl font-bold text-white">12</p>
        <p class="text-xs text-neutral-500 mt-2">Being handled</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-primary-500/20 rounded-lg">
            <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Resolved</h3>
        <p class="text-3xl font-bold text-white">156</p>
        <p class="text-xs text-neutral-500 mt-2">This month</p>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-neutral-500/20 rounded-lg">
            <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 class="text-sm font-medium text-neutral-400 mb-1">Closed</h3>
        <p class="text-3xl font-bold text-white">892</p>
        <p class="text-xs text-neutral-500 mt-2">Total closed</p>
      </div>
    </div>

    <!-- Tickets List -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-neutral-800/50 border-b border-neutral-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Ticket</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            <tr class="table-row cursor-pointer" @click="$router.push('/tickets/1')">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">#TKT-1234</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span class="text-xs font-bold text-white">JD</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">John Doe</div>
                    <div class="text-xs text-neutral-400">john.doe@example.com</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-300">Subscription payment issue</div>
                <div class="text-xs text-neutral-500 mt-1">Unable to process monthly payment...</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-danger">High</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-warning">Open</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                2 hours ago
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary-400 hover:text-primary-300" @click.stop="$router.push('/tickets/1')">View</button>
              </td>
            </tr>

            <tr class="table-row cursor-pointer" @click="$router.push('/tickets/2')">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">#TKT-1233</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-xs font-bold text-white">SM</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">Sarah Miller</div>
                    <div class="text-xs text-neutral-400">sarah.miller@example.com</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-300">Campaign not delivering results</div>
                <div class="text-xs text-neutral-500 mt-1">Expected growth not achieved...</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-warning">Medium</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-info">In Progress</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                5 hours ago
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary-400 hover:text-primary-300" @click.stop="$router.push('/tickets/2')">View</button>
              </td>
            </tr>

            <tr class="table-row cursor-pointer" @click="$router.push('/tickets/3')">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">#TKT-1232</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-brown-500 to-brown-700 rounded-full flex items-center justify-center">
                    <span class="text-xs font-bold text-white">MR</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">Mike Roberts</div>
                    <div class="text-xs text-neutral-400">mike.roberts@example.com</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-300">Account access problem</div>
                <div class="text-xs text-neutral-500 mt-1">Cannot login to dashboard...</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-danger">Urgent</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-warning">Open</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                1 day ago
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary-400 hover:text-primary-300" @click.stop="$router.push('/tickets/3')">View</button>
              </td>
            </tr>

            <tr class="table-row cursor-pointer" @click="$router.push('/tickets/4')">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">#TKT-1231</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span class="text-xs font-bold text-white">AL</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">Alice Johnson</div>
                    <div class="text-xs text-neutral-400">alice.j@example.com</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-neutral-300">Feature request</div>
                <div class="text-xs text-neutral-500 mt-1">Would like to request new feature...</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-info">Low</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-success">Resolved</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                2 days ago
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary-400 hover:text-primary-300" @click.stop="$router.push('/tickets/4')">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
        <div class="text-sm text-neutral-400">
          Showing <span class="text-white font-medium">1</span> to <span class="text-white font-medium">10</span> of <span class="text-white font-medium">184</span> tickets
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-secondary text-sm">Previous</button>
          <button class="btn-primary text-sm">1</button>
          <button class="btn-secondary text-sm">2</button>
          <button class="btn-secondary text-sm">3</button>
          <button class="btn-secondary text-sm">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Tickets - Admin Panel'
})
</script>
