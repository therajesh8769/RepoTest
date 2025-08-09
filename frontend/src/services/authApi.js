import api from './api'

export const authApi = {
  async getGitHubAuthUrl() {
    const response = await api.get('/auth/github/url')
    return response.data // This will return { url: "..." }
  },

  async exchangeCode(code) {
    const response = await api.post('/auth/github/exchange', { code })
    return response.data
  }
}