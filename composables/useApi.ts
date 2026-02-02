export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api'

  // Get auth token from cookie or localStorage
  const getAuthToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Make API request
  const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestInit & { requireAuth?: boolean } = {}
  ): Promise<T> => {
    const { requireAuth = true, ...fetchOptions } = options
    const token = getAuthToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...fetchOptions.headers,
    }

    // Only add token if authentication is required
    if (requireAuth && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }))
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  // GET request
  const get = <T = any>(endpoint: string, requireAuth = true): Promise<T> => {
    return apiRequest<T>(endpoint, { method: 'GET', requireAuth })
  }

  // POST request
  const post = <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  const put = <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH request
  const patch = <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  const del = <T = any>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: 'DELETE' })
  }

  return {
    apiBase,
    get,
    post,
    put,
    patch,
    delete: del,
    getAuthToken,
  }
}
