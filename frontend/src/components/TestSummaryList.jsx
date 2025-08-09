import React from 'react'
import { FileText, ArrowRight } from 'lucide-react'

function TestSummaryList({ summaries, onSummarySelect }) {
  if (!summaries || summaries.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No test summaries available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {summaries.map((fileSummary, fileIndex) => (
        <div key={fileIndex} className="card">
          <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-500" />
            {fileSummary.file}
          </h3>
          
          <div className="space-y-3">
            {fileSummary.testSummaries.map((summary, summaryIndex) => (
              <div
                key={summaryIndex}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                onClick={() => onSummarySelect({
                  ...summary,
                  file: fileSummary.file,
                  fileIndex,
                  summaryIndex
                })}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 group-hover:text-primary-700">
                      {summary.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {summary.description}
                    </p>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors duration-200 ml-4 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TestSummaryList