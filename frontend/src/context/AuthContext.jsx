import { useEffect, useState } from 'react'
import { AuthContext } from './context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check the existing login session when the app opens
  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      credentials: 'include',
    })
      .then(async (response) => {
        if (response.status === 401) {
          return null
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch user.')
        }

        return data.user
      })
      .then((userData) => {
        if (!cancelled) {
          setUser(userData)
        }
      })
      .catch((error) => {
        console.error('Authentication check failed:', error)

        if (!cancelled) {
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Refresh user details after login
  async function refreshUser() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/me`,
      { credentials: 'include' }
    )

    const data = await response.json()

    if (!response.ok) {
      setUser(null)
      throw new Error(data.message || 'Could not fetch user.')
    }

    setUser(data.user)
    return data.user
  }

  // Logout
  async function logout() {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: 'POST',
        credentials: 'include',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed.')
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
