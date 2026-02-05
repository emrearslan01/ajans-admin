export const useContentBoosts = () => {
  const api = useApi()

  // Get all content boosts with filters
  const getContentBoosts = async (params?: {
    status?: string
    user_id?: number
    platform?: string
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.status) queryParams.append('status', params.status)
    if (params?.user_id) queryParams.append('user_id', String(params.user_id))
    if (params?.platform) queryParams.append('platform', params.platform)
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/content-boosts${query ? `?${query}` : ''}`
    
    return await api.get<{
      data: any[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }>(endpoint)
  }

  // Get content boost stats
  const getStats = async () => {
    return await api.get<{ data: any }>('/admin/content-boosts/stats')
  }

  // Get single content boost
  const getContentBoost = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/content-boosts/${id}`)
  }

  // Update content boost status
  const updateStatus = async (id: number | string, status: string, adminNotes?: string) => {
    const body: any = { status }
    if (adminNotes) {
      body.admin_notes = adminNotes
    }
    return await api.patch<{ message: string; data: any }>(`/admin/content-boosts/${id}/status`, body)
  }

  return {
    getContentBoosts,
    getStats,
    getContentBoost,
    updateStatus,
  }
}
