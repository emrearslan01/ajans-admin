export const useCampaigns = () => {
  const api = useApi()

  // Get all campaigns with filters
  const getCampaigns = async (params?: {
    status?: string
    user_id?: number
    plan_id?: number
    platform?: string
    search?: string
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.status) queryParams.append('status', params.status)
    if (params?.user_id) queryParams.append('user_id', String(params.user_id))
    if (params?.plan_id) queryParams.append('plan_id', String(params.plan_id))
    if (params?.platform) queryParams.append('platform', params.platform)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/campaigns${query ? `?${query}` : ''}`
    
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

  // Get campaign stats
  const getStats = async () => {
    return await api.get<{ data: any }>('/admin/campaigns/stats')
  }

  // Get single campaign
  const getCampaign = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/campaigns/${id}`)
  }

  // Update campaign status
  const updateStatus = async (id: number | string, status: string) => {
    return await api.patch<{ message: string; data: any }>(`/admin/campaigns/${id}/status`, { status })
  }

  return {
    getCampaigns,
    getStats,
    getCampaign,
    updateStatus,
  }
}
