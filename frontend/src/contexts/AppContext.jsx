import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [testSummaries, setTestSummaries] = useState([])
  const [selectedSummary, setSelectedSummary] = useState(null)
  const [generatedTest, setGeneratedTest] = useState(null)

  const resetSelection = () => {
    setSelectedRepo(null)
    setSelectedBranch(null)
    setSelectedFiles([])
    setTestSummaries([])
    setSelectedSummary(null)
    setGeneratedTest(null)
  }

  const value = {
    selectedRepo,
    setSelectedRepo,
    selectedBranch,
    setSelectedBranch,
    selectedFiles,
    setSelectedFiles,
    testSummaries,
    setTestSummaries,
    selectedSummary,
    setSelectedSummary,
    generatedTest,
    setGeneratedTest,
    resetSelection
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}