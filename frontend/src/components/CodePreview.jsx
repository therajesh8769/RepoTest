import React, { useState } from 'react'
import { Copy, Check, Code } from 'lucide-react'

function CodePreview({ code, fileName, language = 'javascript' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">{fileName}</span>
          <span className="text-sm text-gray-500">({language})</span>
        </div>
        
        <button
          onClick={handleCopy}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      
      <div className="code-block rounded-none">
        <pre className="text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodePreview