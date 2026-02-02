export const usePlans = () => {
  const api = useApi()

  // Get all plans (using public endpoint for listing, same as frontend)
  // requireAuth = false because this is a public endpoint
  const getPlans = async () => {
    return await api.get<{ data: any[] }>('/plans', false)
  }
  
  // Get all plans (admin endpoint - for admin operations)
  const getAdminPlans = async () => {
    return await api.get<{ data: any[] }>('/admin/plans')
  }

  // Get single plan
  const getPlan = async (id: number | string) => {
    return await api.get<{ data: any }>(`/admin/plans/${id}`)
  }

  // Create plan
  const createPlan = async (data: any) => {
    return await api.post<{ data: any }>('/admin/plans', data)
  }

  // Update plan
  const updatePlan = async (id: number | string, data: any) => {
    return await api.put<{ data: any }>(`/admin/plans/${id}`, data)
  }

  // Delete plan
  const deletePlan = async (id: number | string) => {
    return await api.delete(`/admin/plans/${id}`)
  }

  return {
    getPlans,
    getAdminPlans,
    getPlan,
    createPlan,
    updatePlan,
    deletePlan,
  }
}
