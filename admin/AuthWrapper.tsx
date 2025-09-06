'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = () => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }

    // DEV MODE: Auto-login as super admin in development
    if (process.env.NODE_ENV === 'development') {
      const devAuth = {
        email: 'admin@skulpt.com',
        loggedInAt: new Date().toISOString(),
        role: 'admin',
        isDev: true
      }
      localStorage.setItem('adminAuth', JSON.stringify(devAuth))
      setUserInfo(devAuth)
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

    const auth = localStorage.getItem('adminAuth')
    
    if (!auth) {
      router.push('/admin/login')
      return
    }

    try {
      const authData = JSON.parse(auth)
      
      // Check if session is still valid (24 hour expiry)
      const loginTime = new Date(authData.loggedInAt).getTime()
      const currentTime = new Date().getTime()
      const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60)
      
      if (hoursSinceLogin > 24) {
        localStorage.removeItem('adminAuth')
        router.push('/admin/login')
        return
      }

      setUserInfo(authData)
      setIsAuthenticated(true)
      setIsLoading(false)

      // Check role-based access
      if (pathname === '/admin' && authData.role === 'settings') {
        router.push('/admin/settings')
      }
    } catch (error) {
      localStorage.removeItem('adminAuth')
      router.push('/admin/login')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin/login')
  }

  // Show nothing while checking auth
  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Login page doesn't need auth wrapper UI
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Authenticated pages get the wrapper
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <h2 className="text-xl font-bold text-primary-600">Skulpt Admin</h2>
                <nav className="flex space-x-6">
                  {userInfo?.role === 'admin' && (
                    <a 
                      href="/admin" 
                      className={`text-sm font-medium ${pathname === '/admin' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Dashboard
                    </a>
                  )}
                  <a 
                    href="/admin/settings" 
                    className={`text-sm font-medium ${pathname === '/admin/settings' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Widget Settings
                  </a>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                {userInfo?.isDev && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    DEV MODE
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  {userInfo?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {children}
      </div>
    )
  }

  return null
}