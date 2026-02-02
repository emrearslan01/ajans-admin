export const useAuth = () => {
  const api = useApi()
  const router = useRouter()
  const user = useState<any>('auth_user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: any }>('/auth/login', {
        email,
        password,
      })

      if (response.token) {
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
        }
        user.value = response.user
        return response
      }

      throw new Error('Login failed')
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Get current user
  const me = async () => {
    try {
      const response = await api.get<{ user: any }>('/auth/me')
      user.value = response.user
      return response.user
    } catch (error) {
      console.error('Get me error:', error)
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
      user.value = null
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
      user.value = null
      router.push('/login')
    }
  }

  // Check if user is admin
  const isAdmin = computed(() => user.value?.is_admin === true)

  // Initialize auth on mount
  if (process.client) {
    const token = api.getAuthToken()
    if (token && !user.value) {
      me().catch(() => {
        // Silent fail if token is invalid
      })
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    login,
    logout,
    me,
  }
}
