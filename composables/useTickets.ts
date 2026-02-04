export const useTickets = () => {
  const api = useApi()

  // Get all tickets with filters
  const getTickets = async (params?: {
    status?: string
    category?: string
    assigned_to?: number
    unassigned?: boolean
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.status) queryParams.append('status', params.status)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.assigned_to) queryParams.append('assigned_to', String(params.assigned_to))
    if (params?.unassigned) queryParams.append('unassigned', '1')
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/tickets${query ? `?${query}` : ''}`
    
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

  // Get ticket statistics
  const getStats = async () => {
    return await api.get<{ 
      data: {
        total: number
        open: number
        in_progress: number
        waiting: number
        resolved: number
        closed: number
        by_category: Record<string, number>
      }
    }>('/admin/tickets/stats')
  }

  // Get single ticket
  const getTicket = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/tickets/${id}`)
  }

  // Update ticket
  const updateTicket = async (id: number | string, data: {
    status?: string
    admin_response?: string
    assigned_to?: number | null
  }) => {
    return await api.put<{ message: string; data: any }>(`/admin/tickets/${id}`, data)
  }

  // Delete ticket
  const deleteTicket = async (id: number | string) => {
    return await api.delete<{ message: string }>(`/admin/tickets/${id}`)
  }

  return {
    getTickets,
    getStats,
    getTicket,
    updateTicket,
    deleteTicket,
  }
}
