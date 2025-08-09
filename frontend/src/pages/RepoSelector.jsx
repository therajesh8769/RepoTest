import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { githubApi } from '../services/githubApi'
import { Book, GitBranch, ArrowRight, Search, RefreshCw } from 'lucide-react'
import Loader from '../components/Loader'

function RepoSelector() {
  const navigate = useNavigate()
  const { setSelectedRepo, setSelectedBranch, resetSelection } = useApp()
  
  const [repositories, setRepositories] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedRepoData, setSelectedRepoData] = useState(null)
  const [selectedBranchData, setSelectedBranchData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [branchesLoading, setBranchesLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    resetSelection()
    loadRepositories()
  }, [])

  const loadRepositories = async () => {
    try {
      setLoading(true)
      setError(null)
      const repos = await githubApi.getRepositories()
      setRepositories(repos)
    } catch (error) {
      console.error('Failed to load repositories:', error)
      setError('Failed to load repositories')
    } finally {
      setLoading(false)
    }
  }

  const handleRepoSelect = async (repo) => {
    try {
      setSelectedRepoData(repo)
      setSelectedBranchData(null)
      setBranches([])
      setBranchesLoading(true)
      
      const [owner, repoName] = repo.fullName.split('/')
      const repoBranches = await githubApi.getBranches(owner, repoName)
      setBranches(repoBranches)
    } catch (error) {
      console.error('Failed to load branches:', error)
      setError('Failed to load branches')
    } finally {
      setBranchesLoading(false)
    }
  }

  const handleBranchSelect = (branch) => {
    setSelectedBranchData(branch)
  }

  const handleContinue = () => {
    if (selectedRepoData && selectedBranchData) {
      setSelectedRepo(selectedRepoData)
      setSelectedBranch(selectedBranchData)
      navigate('/files')
    }
  }

  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <Loader message="Loading your repositories..." />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Select Repository & Branch
        </h1>
        <p className="text-gray-600">
          Choose a repository and branch to analyze for test case generation
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadRepositories}
            className="btn-secondary mt-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Repositories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Repositories ({filteredRepos.length})
            </h2>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedRepoData?.id === repo.id 
                    ? 'ring-2 ring-primary-500 bg-primary-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleRepoSelect(repo)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {repo.name}
                    </h3>
                    {repo.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {repo.language && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {repo.language}
                        </span>
                      )}
                      <span>
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {repo.private && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Private
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branches */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branches {branches.length > 0 && `(${branches.length})`}
          </h2>

          {!selectedRepoData ? (
            <div className="card text-center py-12">
              <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a repository to view branches</p>
            </div>
          ) : branchesLoading ? (
            <Loader message="Loading branches..." />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {branches.map((branch) => (
                <div
                  key={branch.name}
                  className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedBranchData?.name === branch.name 
                      ? 'ring-2 ring-primary-500 bg-primary-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleBranchSelect(branch)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {branch.sha.substring(0, 8)}
                      </p>
                    </div>
                    
                    {branch.name === 'main' || branch.name === 'master' ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      {selectedRepoData && selectedBranchData && (
        <div className="mt-8 text-center">
          <div className="card inline-block mb-6">
            <p className="text-sm text-gray-600 mb-2">Selected:</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{selectedRepoData.fullName}</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">{selectedBranchData.name}</span>
            </div>
          </div>
          
          <div>
            <button onClick={handleContinue} className="btn-primary">
              Continue to File Selection
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RepoSelector