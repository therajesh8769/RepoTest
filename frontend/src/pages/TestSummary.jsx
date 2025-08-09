// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useApp } from '../contexts/AppContext'
// import { ArrowLeft } from 'lucide-react'
// import TestSummaryList from '../components/TestSummaryList'
// import Loader from '../components/Loader'

// function TestSummary() {
//   const navigate = useNavigate()
//   const { selectedRepo, selectedBranch, testSummaries, setSelectedSummary } = useApp()

//   const handleSummarySelect = (summary) => {
//     setSelectedSummary(summary)
//     navigate('/generator')
//   }

//   const handleBack = () => {
//     navigate('/files')
//   }

//   if (!selectedRepo || !selectedBranch) {
//     return <Loader message="Redirecting..." />
//   }

//   // Always normalize here too (double safety)
//   const safeSummaries = Array.isArray(testSummaries)
//     ? testSummaries
//     : Object.values(testSummaries || {})

//   if (safeSummaries.length === 0) {
//     return <Loader message="Loading test summaries..." />
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Case Summaries</h1>
//         <p className="text-gray-600 mb-4">AI has analyzed your code and generated these test case suggestions</p>

//         <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm">
//           <span className="font-medium">{selectedRepo.fullName}</span>
//           <span className="text-gray-400">•</span>
//           <span className="font-medium">{selectedBranch.name}</span>
//         </div>
//       </div>

//       {/* Test Summaries */}
//       <div className="mb-8">
//         <TestSummaryList summaries={safeSummaries} onSummarySelect={handleSummarySelect} />
//       </div>

//       {/* Back Button */}
//       <div className="flex justify-start">
//         <button onClick={handleBack} className="btn-secondary">
//           <ArrowLeft className="h-5 w-5" />
//           Back to File Selection
//         </button>
//       </div>
//     </div>
//   )
// }

// export default TestSummary
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import TestSummaryList from '../components/TestSummaryList'
import Loader from '../components/Loader'

function TestSummary() {
  const navigate = useNavigate()
  const { 
    selectedRepo,
    selectedBranch,
    testSummaries, 
    setSelectedSummary 
  } = useApp()

  const handleSummarySelect = (summary) => {
    setSelectedSummary(summary)
    navigate('/generator')
  }

  const handleBack = () => {
    navigate('/files')
  }

  if (!selectedRepo || !selectedBranch) {
    return <Loader message="Redirecting..." />
  }

  if (!testSummaries || testSummaries.length === 0) {
    return <Loader message="Loading test summaries..." />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Test Case Summaries
        </h1>
        <p className="text-gray-600 mb-4">
          AI has analyzed your code and generated these test case suggestions
        </p>
        
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm">
          <span className="font-medium">{selectedRepo.fullName}</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium">{selectedBranch.name}</span>
        </div>
      </div>

      {/* Test Summaries */}
      <div className="mb-8">
        <TestSummaryList 
          summaries={testSummaries}
          onSummarySelect={handleSummarySelect}
        />
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <button onClick={handleBack} className="btn-secondary">
          <ArrowLeft className="h-5 w-5" />
          Back to File Selection
        </button>
      </div>
    </div>
  )
}

export default TestSummary