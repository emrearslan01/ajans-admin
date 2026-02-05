export const useBlogs = () => {
  const api = useApi()

  // Get all blogs with filters (admin)
  const getBlogs = async (params?: {
    status?: string
    search?: string
    per_page?: number
    page?: number
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const query = queryParams.toString()
    const endpoint = `/admin/blogs${query ? `?${query}` : ''}`
    
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

  // Get blog stats
  const getStats = async () => {
    return await api.get<{ data: any }>('/admin/blogs/stats')
  }

  // Get single blog
  const getBlog = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/blogs/${id}`)
  }

  // Create blog
  const createBlog = async (data: any) => {
    return await api.post<{ message: string; data: any }>('/admin/blogs', data)
  }

  // Update blog
  const updateBlog = async (id: number | string, data: any) => {
    return await api.put<{ message: string; data: any }>(`/admin/blogs/${id}`, data)
  }

  // Delete blog
  const deleteBlog = async (id: number | string) => {
    return await api.delete<{ message: string }>(`/admin/blogs/${id}`)
  }

  return {
    getBlogs,
    getStats,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
  }
}
