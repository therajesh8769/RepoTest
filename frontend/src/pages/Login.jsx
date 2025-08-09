import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../services/authApi'
import { Github, Code, Zap, FileText, GitPullRequest } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const code = urlParams.get('code')
    
    if (code) {
      handleOAuthCallback(code)
    }
  }, [location])

  const handleOAuthCallback = async (code) => {
    try {
      setLoading(true)
      setError(null)
      const response = await login(code)
      if (response && response.user) {
        navigate('/repositories')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      const { url } = await authApi.getGitHubAuthUrl(); // Destructure the url from response
      window.location.href = url;
    } catch (error) {
      console.error('GitHub login failed:', error);
      setError('Failed to initialize GitHub login');
    } finally {
      setLoading(false);
    }
  }

  const urlParams = new URLSearchParams(location.search)
  const code = urlParams.get('code')

  if (code && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <span className="ml-4">Logging you in...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Code className="h-12 w-12 text-primary-500" />
          <h1 className="text-4xl font-bold text-gray-900">
            AI Test Case Generator
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">
          Generate comprehensive test cases for your GitHub repositories using AI
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <Github className="h-8 w-8 text-primary-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">GitHub Integration</h3>
          <p className="text-gray-600 text-sm">
            Connect your GitHub account and browse your repositories
          </p>
        </div>
        
        <div className="card text-center">
          <Zap className="h-8 w-8 text-primary-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
          <p className="text-gray-600 text-sm">
            GPT-4 analyzes your code and generates intelligent test cases
          </p>
        </div>
        
        <div className="card text-center">
          <GitPullRequest className="h-8 w-8 text-primary-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Pull Request Ready</h3>
          <p className="text-gray-600 text-sm">
            Generate tests and create pull requests automatically
          </p>
        </div>
      </div>

      {/* Login */}
      <div className="card max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Get Started
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleGitHubLogin}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Connecting...
            </>
          ) : (
            <>
              <Github className="h-5 w-5" />
              Continue with GitHub
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-4">
          We only access your public repositories and basic profile information
        </p>
      </div>

      {/* How it works */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          How it works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Select Repository</h3>
            <p className="text-sm text-gray-600">Choose a repository and branch to analyze</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Select Files</h3>
            <p className="text-sm text-gray-600">Pick the code files you want to test</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">AI generates test case summaries and code</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Create PR</h3>
            <p className="text-sm text-gray-600">Review and create a pull request</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login