import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { LogOut, Github, Code } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const { resetSelection } = useApp()

  const handleLogout = () => {
    resetSelection()
    logout()
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Code className="h-8 w-8 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-900">
              AI Test Generator
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name || user.login}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.login}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm py-1.5 px-3"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar