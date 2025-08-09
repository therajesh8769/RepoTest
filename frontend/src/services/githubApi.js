import api from './api'

export const githubApi = {
  async getRepositories() {
    const response = await api.get('/github/repositories')
    return response.data
  },

  async getBranches(owner, repo) {
    const response = await api.get(`/github/repositories/${owner}/${repo}/branches`)
    return response.data
  },

  async getRepositoryContents(owner, repo, branch = 'main', path = '') {
    const response = await api.get(`/github/repositories/${owner}/${repo}/contents`, {
      params: { branch, path }
    })
    return response.data
  },

  async getFileContents(owner, repo, files, branch = 'main') {
    const response = await api.post(`/github/repositories/${owner}/${repo}/files/content`, {
      files,
      branch
    })
    return response.data
  },

  async createPullRequest(owner, repo, data) {
    const response = await api.post(`/github/repositories/${owner}/${repo}/pull-request`, data)
    return response.data
  }
}