import React from 'react'

function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  )
}

export default Loader