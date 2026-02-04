export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware for login page
  if (to.path === '/login') {
    return
  }

  const { isAuthenticated, isAdmin, me } = useAuth()

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    // Try to get user from token
    try {
      await me()
      // Check again after me() call
      if (!isAuthenticated.value || !isAdmin.value) {
        return navigateTo('/login')
      }
    } catch {
      // Token is invalid or expired, redirect to login
      return navigateTo('/login')
    }
  }

  // Check if user is admin
  if (!isAdmin.value) {
    return navigateTo('/login')
  }
})
