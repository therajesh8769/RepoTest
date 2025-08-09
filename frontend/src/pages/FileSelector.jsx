import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { githubApi } from '../services/githubApi'
import { ArrowRight, ArrowLeft, Folder, Code } from 'lucide-react'
import FileList from '../components/FileList'
import Loader from '../components/Loader'

function FileSelector() {
  const navigate = useNavigate()
  const { 
    selectedRepo, 
    selectedBranch, 
    selectedFiles, 
    setSelectedFiles,
    setTestSummaries 
  } = useApp()
  
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedRepo || !selectedBranch) {
      navigate('/repositories')
      return
    }
    loadFiles()
  }, [selectedRepo, selectedBranch])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [owner, repo] = selectedRepo.fullName.split('/')
      const repoFiles = await githubApi.getRepositoryContents(
        owner, 
        repo, 
        selectedBranch.name
      )
      
      setFiles(repoFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
      setError('Failed to load repository files')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    if (selectedFiles.length === 0) return
    
    try {
      setGenerating(true)
      setError(null)
      
      const [owner, repo] = selectedRepo.fullName.split('/')
      
      // Get file contents
      const fileContents = await githubApi.getFileContents(
        owner,
        repo,
        selectedFiles,
        selectedBranch.name
      )
      
      // Generate test summaries
      const { aiApi } = await import('../services/aiApi')
      const summaries = await aiApi.generateTestSummaries(fileContents)
      
      setTestSummaries(summaries)
      navigate('/summaries')
    } catch (error) {
      console.error('Failed to generate summaries:', error)
      setError('Failed to generate test summaries. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleBack = () => {
    navigate('/repositories')
  }

  if (!selectedRepo || !selectedBranch) {
    return <Loader message="Redirecting..." />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Select Files for Testing
        </h1>
        <p className="text-gray-600 mb-4">
          Choose the code files you want to generate test cases for
        </p>
        
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm">
          <Folder className="h-4 w-4" />
          <span className="font-medium">{selectedRepo.fullName}</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium">{selectedBranch.name}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* File Selection */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Files {!loading && `(${files.length})`}
          </h2>
          
          {selectedFiles.length > 0 && (
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              {selectedFiles.length} selected
            </span>
          )}
        </div>
        
        <FileList
          files={files}
          selectedFiles={selectedFiles}
          onFileSelect={setSelectedFiles}
          loading={loading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="btn-secondary">
          <ArrowLeft className="h-5 w-5" />
          Back to Repository
        </button>
        
        {selectedFiles.length > 0 && (
          <button 
            onClick={handleContinue}
            disabled={generating}
            className="btn-primary"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Summaries...
              </>
            ) : (
              <>
                Generate Test Summaries
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Selected Files:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            {selectedFiles.map((file) => (
              <div key={file.path}>{file.path}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileSelector