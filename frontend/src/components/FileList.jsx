import React from 'react'
import { File, Code, Check } from 'lucide-react'

function FileList({ files, selectedFiles, onFileSelect, loading }) {
  const handleFileToggle = (file) => {
    const isSelected = selectedFiles.some(f => f.path === file.path)
    
    if (isSelected) {
      onFileSelect(selectedFiles.filter(f => f.path !== file.path))
    } else {
      onFileSelect([...selectedFiles, file])
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No code files found in this repository</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const isSelected = selectedFiles.some(f => f.path === file.path)
        
        return (
          <div
            key={file.path}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleFileToggle(file)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>
                
                <File className="h-5 w-5 text-gray-400" />
                
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.path}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FileList