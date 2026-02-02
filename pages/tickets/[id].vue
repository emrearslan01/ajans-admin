<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/tickets" class="p-2 rounded-lg hover:bg-neutral-900 transition-colors">
          <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-white">Ticket #TKT-1234</h1>
          <p class="text-neutral-400 mt-1">Subscription payment issue</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <select class="input-field">
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <select class="input-field">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option selected>Urgent</option>
        </select>
        <button class="btn-primary">Update Status</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Ticket Info Card -->
        <div class="card p-6">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <span class="text-lg font-bold text-white">JD</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">John Doe</h3>
                <p class="text-sm text-neutral-400">john.doe@example.com</p>
                <p class="text-xs text-neutral-500 mt-1">Premium Plan • User ID: #1234</p>
              </div>
            </div>
            <div class="text-right">
              <span class="badge badge-danger mb-2 block">Urgent</span>
              <span class="badge badge-warning">Open</span>
            </div>
          </div>

          <div class="border-t border-neutral-800 pt-6">
            <h4 class="text-sm font-semibold text-neutral-400 mb-3">MESSAGE</h4>
            <div class="bg-neutral-800/50 rounded-lg p-4 mb-4">
              <p class="text-neutral-300 leading-relaxed">
                Hello, I'm having trouble with my subscription payment. I tried to update my payment method but it keeps failing. 
                The error message says "Payment processing failed" but doesn't give me more details. 
                I've tried multiple credit cards and they all fail. Can you please help me resolve this issue?
              </p>
            </div>
            <div class="flex items-center gap-4 text-xs text-neutral-500">
              <span>Created: 2 hours ago</span>
              <span>•</span>
              <span>Last updated: 1 hour ago</span>
            </div>
          </div>
        </div>

        <!-- Conversation Thread -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-6">Conversation</h3>
          
          <div class="space-y-6">
            <!-- Customer Message -->
            <div class="flex gap-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-white">JD</span>
              </div>
              <div class="flex-1">
                <div class="bg-neutral-800/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-white">John Doe</span>
                    <span class="text-xs text-neutral-500">2 hours ago</span>
                  </div>
                  <p class="text-neutral-300 text-sm leading-relaxed">
                    Hello, I'm having trouble with my subscription payment. I tried to update my payment method but it keeps failing.
                  </p>
                </div>
              </div>
            </div>

            <!-- Admin Response -->
            <div class="flex gap-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-white">A</span>
              </div>
              <div class="flex-1">
                <div class="bg-primary-500/20 border border-primary-500/30 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-primary-400">Admin User</span>
                    <span class="text-xs text-neutral-500">1 hour ago</span>
                  </div>
                  <p class="text-neutral-300 text-sm leading-relaxed">
                    Thank you for contacting us. I've reviewed your account and I can see the payment issue. 
                    Let me check with our payment processor and get back to you shortly.
                  </p>
                </div>
              </div>
            </div>

            <!-- Customer Reply -->
            <div class="flex gap-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-white">JD</span>
              </div>
              <div class="flex-1">
                <div class="bg-neutral-800/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-white">John Doe</span>
                    <span class="text-xs text-neutral-500">30 minutes ago</span>
                  </div>
                  <p class="text-neutral-300 text-sm leading-relaxed">
                    Thank you for the quick response. I'll wait for your update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply Form -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Reply to Ticket</h3>
          <div class="space-y-4">
            <textarea
              v-model="replyMessage"
              rows="6"
              class="input-field w-full"
              placeholder="Type your response here..."
            ></textarea>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="rounded border-neutral-700 bg-neutral-800 text-primary-500">
                  <span class="text-sm text-neutral-400">Mark as resolved</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="rounded border-neutral-700 bg-neutral-800 text-primary-500">
                  <span class="text-sm text-neutral-400">Send email notification</span>
                </label>
              </div>
              <button class="btn-primary">Send Reply</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Ticket Details -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Ticket Details</h3>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-neutral-400 mb-1">Ticket ID</p>
              <p class="text-sm font-medium text-white">#TKT-1234</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Status</p>
              <span class="badge badge-warning">Open</span>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Priority</p>
              <span class="badge badge-danger">Urgent</span>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Category</p>
              <p class="text-sm text-white">Payment Issue</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Created</p>
              <p class="text-sm text-white">Mar 15, 2024 14:30</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Last Updated</p>
              <p class="text-sm text-white">Mar 15, 2024 15:45</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Assigned To</p>
              <p class="text-sm text-white">Admin User</p>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Customer Information</h3>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-neutral-400 mb-1">Name</p>
              <p class="text-sm font-medium text-white">John Doe</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Email</p>
              <p class="text-sm text-white">john.doe@example.com</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Phone</p>
              <p class="text-sm text-white">+1 (555) 123-4567</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Plan</p>
              <p class="text-sm text-white">Premium Plan</p>
            </div>
            <div>
              <p class="text-xs text-neutral-400 mb-1">Member Since</p>
              <p class="text-sm text-white">Jan 15, 2024</p>
            </div>
            <div class="pt-4 border-t border-neutral-800">
              <NuxtLink to="/users/1234" class="btn-secondary w-full text-center">
                View Customer Profile
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <button class="w-full btn-secondary text-left">Assign to Team Member</button>
            <button class="w-full btn-secondary text-left">Add Internal Note</button>
            <button class="w-full btn-secondary text-left">View Related Tickets</button>
            <button class="w-full btn-secondary text-left text-red-400 hover:text-red-300">Close Ticket</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const replyMessage = ref('')

useHead({
  title: `Ticket #${route.params.id} - Admin Panel`
})
</script>
