import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { aiApi } from '../services/aiApi'
import { githubApi } from '../services/githubApi'
import { ArrowLeft, GitPullRequest, Eye, Code, ExternalLink } from 'lucide-react'
import CodePreview from '../components/CodePreview'
import Loader from '../components/Loader'

function TestGenerator() {
  const navigate = useNavigate()
  const { 
    selectedRepo,
    selectedBranch,
    selectedSummary,
    selectedFiles,
    generatedTest,
    setGeneratedTest 
  } = useApp()
  
  const [loading, setLoading] = useState(false)
  const [creatingPR, setCreatingPR] = useState(false)
  const [error, setError] = useState(null)
  const [pullRequest, setPullRequest] = useState(null)

  useEffect(() => {
    if (!selectedRepo || !selectedBranch || !selectedSummary) {
      navigate('/summaries')
      return
    }
    
    if (!generatedTest) {
      generateTestCode()
    }
  }, [selectedSummary])

  const generateTestCode = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Find the original file content
      const originalFile = selectedFiles.find(f => f.path === selectedSummary.file) || selectedFiles[0]

      
      if (!originalFile) {
        throw new Error('Original file not found')
      }
      
      const testData = await aiApi.generateTestCode(originalFile, selectedSummary)
      setGeneratedTest(testData)
    } catch (error) {
      console.error('Failed to generate test code:', error)
      setError('Failed to generate test code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePR = async () => {
    try {
      setCreatingPR(true)
      setError(null)
      
      const [owner, repo] = selectedRepo.fullName.split('/')
      
      const prData = await githubApi.createPullRequest(owner, repo, {
        testCode: generatedTest.testCode,
        testSummary: selectedSummary,
        originalFile: generatedTest.originalFile,
        branch: selectedBranch.name
      })
      
      setPullRequest(prData.pullRequest)
    } catch (error) {
      console.error('Failed to create pull request:', error)
      setError('Failed to create pull request. Please try again.')
    } finally {
      setCreatingPR(false)
    }
  }

  const handleBack = () => {
    navigate('/summaries')
  }

  if (!selectedRepo || !selectedBranch || !selectedSummary) {
    return <Loader message="Redirecting..." />
  }

  if (loading) {
    return <Loader message="Generating test code with AI..." />
  }

  if (pullRequest) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="card max-w-lg mx-auto">
          <div className="text-green-600 mb-4">
            <GitPullRequest className="h-16 w-16 mx-auto" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pull Request Created!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your AI-generated test has been added to a pull request.
          </p>
          
          <div className="space-y-4">
            <div className="text-sm text-left">
              <p><strong>PR #{pullRequest.number}:</strong> {pullRequest.title}</p>
              <p><strong>Repository:</strong> {selectedRepo.fullName}</p>
              <p><strong>Branch:</strong> add-ai-tests → {selectedBranch.name}</p>
            </div>
            
            <div className="flex gap-3">
              <a
                href={pullRequest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
              >
                <ExternalLink className="h-4 w-4" />
                View Pull Request
              </a>
              
              <button
                onClick={() => navigate('/repositories')}
                className="btn-secondary flex-1"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generated Test Code
        </h1>
        <p className="text-gray-600 mb-4">
          Review the AI-generated test code and create a pull request
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={generateTestCode}
            className="btn-secondary mt-2"
          >
            Retry Generation
          </button>
        </div>
      )}

      {/* Test Summary */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Test Summary
        </h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            {selectedSummary.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {selectedSummary.description}
          </p>
          <p className="text-xs text-gray-500">
            For file: <code className="bg-gray-200 px-1 rounded">{selectedSummary.file}</code>
          </p>
        </div>
      </div>

      {/* Generated Code */}
      {generatedTest && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Generated Test Code
            </h2>
          </div>
          
          <CodePreview
            code={generatedTest.testCode}
            fileName={generatedTest.testFileName}
            language={generatedTest.originalFile?.language?.toLowerCase() || 'javascript'}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="btn-secondary">
          <ArrowLeft className="h-5 w-5" />
          Back to Summaries
        </button>
        
        {generatedTest && (
          <button 
            onClick={handleCreatePR}
            disabled={creatingPR}
            className="btn-primary"
          >
            {creatingPR ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Pull Request...
              </>
            ) : (
              <>
                <GitPullRequest className="h-5 w-5" />
                Create Pull Request
              </>
            )}
          </button>
        )}
      </div>

      {/* Instructions */}
      {generatedTest && !pullRequest && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Review the generated test code above</li>
            <li>Click "Create Pull Request" to add this test to your repository</li>
            <li>The test will be created in a new branch called "add-ai-tests"</li>
            <li>You can review and merge the PR from GitHub</li>
          </ol>
        </div>
      )}
    </div>
  )
}

export default TestGenerator