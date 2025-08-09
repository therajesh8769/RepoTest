import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Router />
            </main>
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App