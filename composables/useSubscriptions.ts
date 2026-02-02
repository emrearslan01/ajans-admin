export const useSubscriptions = () => {
  const api = useApi()

  // Get all subscriptions with filters
  const getSubscriptions = async (params?: {
    status?: string
    provider?: string
    plan_id?: number
    user_id?: number
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.status) queryParams.append('status', params.status)
    if (params?.provider) queryParams.append('provider', params.provider)
    if (params?.plan_id) queryParams.append('plan_id', String(params.plan_id))
    if (params?.user_id) queryParams.append('user_id', String(params.user_id))
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/subscriptions${query ? `?${query}` : ''}`
    
    return await api.get<{
      data: any[]
      meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
      }
    }>(endpoint)
  }

  // Get subscription stats
  const getStats = async () => {
    return await api.get<{ data: any }>('/admin/subscriptions/stats')
  }

  // Get single subscription
  const getSubscription = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/subscriptions/${id}`)
  }

  return {
    getSubscriptions,
    getStats,
    getSubscription,
  }
}
