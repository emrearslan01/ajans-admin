export const useFulfillmentTasks = () => {
  const api = useApi()

  // Get all fulfillment tasks
  const getTasks = async (params?: {
    status?: string
    campaign_id?: number
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.status) queryParams.append('status', params.status)
    if (params?.campaign_id) queryParams.append('campaign_id', String(params.campaign_id))
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/fulfillment-tasks${query ? `?${query}` : ''}`
    
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

  // Get single task
  const getTask = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/fulfillment-tasks/${id}`)
  }

  // Create task
  const createTask = async (data: any) => {
    return await api.post<{ data: any }>('/admin/fulfillment-tasks', data)
  }

  // Update task
  const updateTask = async (id: number | string, data: any) => {
    return await api.put<{ data: any }>(`/admin/fulfillment-tasks/${id}`, data)
  }

  // Delete task
  const deleteTask = async (id: number | string) => {
    return await api.delete(`/admin/fulfillment-tasks/${id}`)
  }

  return {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
  }
}
