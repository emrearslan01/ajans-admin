export const useActivityLogs = () => {
  const api = useApi()

  // Get all activity logs
  const getLogs = async (params?: {
    user_id?: number
    action?: string
    action_type?: string
    model_type?: string
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.user_id) queryParams.append('user_id', String(params.user_id))
    if (params?.action) queryParams.append('action', params.action)
    if (params?.action_type) queryParams.append('action', params.action_type) // Backend uses 'action'
    if (params?.model_type) queryParams.append('model_type', params.model_type)
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/activity-logs${query ? `?${query}` : ''}`
    
    return await api.get<{
      data: any[]
      meta?: {
        current_page: number
        last_page: number
        per_page: number
        total: number
      }
    }>(endpoint)
  }

  // Get single log
  const getLog = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/activity-logs/${id}`)
  }

  return {
    getLogs,
    getLog,
  }
}
