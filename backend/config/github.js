const { Octokit } = require('@octokit/rest');

const createOctokitInstance = (token) => {
  return new Octokit({
    auth: token,
    userAgent: 'test-case-generator v1.0.0'
  });
};

const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: process.env.GITHUB_REDIRECT_URI

};

module.exports = { createOctokitInstance, githubConfig };