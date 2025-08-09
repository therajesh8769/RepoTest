// import api from './api'

// export const aiApi = {
//   async generateTestSummaries(files) {
//     const response = await api.post('/ai/test-summaries', { files })
//     console.log('AI response 1:', response.data)
//     let data = response.data
//   console.log('AI response:', data)
//     // Normalize to array
//     if (!Array.isArray(data)) {
//       if (typeof data === 'string') {
//         data = [{ title: 'AI output', description: data }]
//       } else if (data && typeof data === 'object') {
//         data = Object.entries(data).map(([key, value], idx) => ({
//           title: value.title || `Item ${idx + 1}`,
//           description: value.description || JSON.stringify(value)
//         }))
//       } else {
//         data = []
//       }
//     }

//     return data
//   },

//   async generateTestCode(file, testSummary) {
//     const response = await api.post('/ai/test-code', { file, testSummary })
//     return response.data
//   }
// }
import api from './api'

export const aiApi = {
  async generateTestSummaries(files) {
    const response = await api.post('/ai/test-summaries', { files })
    const summaries = response.data

    // Wrap the plain summaries array into your expected structure
    return [
      {
        file: 'Combined Summaries', // or actual file name if needed
        testSummaries: summaries
      }
    ]
  },

  async generateTestCode(file, testSummary) {
    const response = await api.post('/ai/test-code', { file, testSummary })
    return response.data
  }
}
