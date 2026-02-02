export const useDashboard = () => {
  const api = useApi()

  // Get dashboard stats
  const getDashboardStats = async () => {
    try {
      // Fetch all stats in parallel
      const [usersResponse, subscriptionsResponse, campaignsResponse, tasksResponse] = await Promise.all([
        api.get('/admin/users?per_page=1').catch(() => ({ meta: { total: 0 } })),
        api.get('/admin/subscriptions/stats').catch(() => ({ data: {} })),
        api.get('/admin/campaigns/stats').catch(() => ({ data: {} })),
        api.get('/admin/fulfillment-tasks?per_page=1').catch(() => ({ meta: { total: 0 } })),
      ])

      return {
        totalUsers: usersResponse.meta?.total || 0,
        subscriptions: subscriptionsResponse.data || {},
        campaigns: campaignsResponse.data || {},
        totalTasks: tasksResponse.meta?.total || 0,
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // Get recent subscriptions
  const getRecentSubscriptions = async (limit = 3) => {
    try {
      const response = await api.get(`/admin/subscriptions?per_page=${limit}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching recent subscriptions:', error)
      return []
    }
  }

  // Get recent tickets (if tickets endpoint exists)
  const getRecentTickets = async (limit = 3) => {
    try {
      // This would need to be implemented in backend
      // For now, return empty array
      return []
    } catch (error) {
      console.error('Error fetching recent tickets:', error)
      return []
    }
  }

  return {
    getDashboardStats,
    getRecentSubscriptions,
    getRecentTickets,
  }
}
