const { createOctokitInstance } = require('../config/github');
const logger = require('../utils/logger');

class GitHubService {
  constructor(token) {
    this.octokit = createOctokitInstance(token);
  }

  async getUserRepositories() {
    try {
      const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      });
      
      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        updatedAt: repo.updated_at,
        private: repo.private
      }));
    } catch (error) {
      logger.error('Failed to fetch repositories', { error: error.message });
      throw new Error('Failed to fetch repositories');
    }
  }

  async getRepositoryBranches(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
        per_page: 50
      });
      
      return data.map(branch => ({
        name: branch.name,
        sha: branch.commit.sha
      }));
    } catch (error) {
      logger.error('Failed to fetch branches', { error: error.message });
      throw new Error('Failed to fetch branches');
    }
  }

  async getRepositoryContents(owner, repo, path = '', branch = 'main') {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      });
      
      if (Array.isArray(data)) {
        return data
          .filter(item => item.type === 'file' && this.isCodeFile(item.name))
          .map(file => ({
            name: file.name,
            path: file.path,
            size: file.size,
            sha: file.sha,
            type: file.type
          }));
      }
      
      return [];
    } catch (error) {
      logger.error('Failed to fetch repository contents', { error: error.message });
      throw new Error('Failed to fetch repository contents');
    }
  }

  async getFileContent(owner, repo, path, branch = 'main') {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      });
      
      if (data.content) {
        return {
          content: Buffer.from(data.content, 'base64').toString('utf8'),
          sha: data.sha,
          size: data.size
        };
      }
      
      throw new Error('File content not found');
    } catch (error) {
      logger.error('Failed to fetch file content', { error: error.message });
      throw new Error('Failed to fetch file content');
    }
  }

  async createPullRequest(owner, repo, title, body, head, base = 'main') {
    try {
      const { data } = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title,
        body,
        head,
        base
      });
      
      return {
        number: data.number,
        url: data.html_url,
        title: data.title
      };
    } catch (error) {
      logger.error('Failed to create pull request', { error: error.message });
      throw new Error('Failed to create pull request');
    }
  }

  async createBranch(owner, repo, branchName, baseSha) {
    try {
      await this.octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: baseSha
      });
      
      return branchName;
    } catch (error) {
      if (error.message.includes('already exists')) {
        return branchName; // Branch already exists, that's okay
      }
      logger.error('Failed to create branch', { error: error.message });
      throw new Error('Failed to create branch');
    }
  }

  async createFile(owner, repo, path, content, message, branch) {
    try {
      const { data } = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        branch
      });
      
      return {
        sha: data.content.sha,
        path: data.content.path
      };
    } catch (error) {
      logger.error('Failed to create file', { error: error.message });
      throw new Error('Failed to create file');
    }
  }

  isCodeFile(filename) {
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.cpp', '.c', '.cs', '.rb', '.php'];
    return extensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}

module.exports = GitHubService;