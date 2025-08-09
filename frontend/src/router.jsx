import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import RepoSelector from './pages/RepoSelector'
import FileSelector from './pages/FileSelector'
import TestSummary from './pages/TestSummary'
import TestGenerator from './pages/TestGenerator'

function Router() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Add this route for GitHub OAuth callback */}
      <Route 
        path="/auth/callback" 
        element={<Login />} 
      />
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/repositories" replace />} 
      />
      <Route 
        path="/repositories" 
        element={user ? <RepoSelector /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/files" 
        element={user ? <FileSelector /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/summaries" 
        element={user ? <TestSummary /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/generator" 
        element={user ? <TestGenerator /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/repositories" : "/login"} replace />} 
      />
    </Routes>
  )
}

export default Router