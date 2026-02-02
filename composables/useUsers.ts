export const useUsers = () => {
  const api = useApi()

  // Get all users with pagination and filters
  const getUsers = async (params?: {
    search?: string
    is_admin?: boolean
    verified?: boolean
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.search) queryParams.append('search', params.search)
    if (params?.is_admin !== undefined) queryParams.append('is_admin', String(params.is_admin))
    if (params?.verified !== undefined) queryParams.append('verified', String(params.verified))
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/users${query ? `?${query}` : ''}`
    
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

  // Get single user
  const getUser = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/users/${id}`)
  }

  return {
    getUsers,
    getUser,
  }
}
