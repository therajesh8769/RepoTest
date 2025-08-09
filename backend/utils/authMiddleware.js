const { Octokit } = require('@octokit/rest');
const { githubConfig } = require('../config/github');
const logger = require('./logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token with GitHub
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.rest.users.getAuthenticated();
    
    req.user = user;
    req.octokit = octokit;
    next();
  } catch (error) {
    logger.error('Authentication failed', { error: error.message });
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const validateGithubConfig = (req, res, next) => {
  if (!githubConfig.clientId || !githubConfig.redirectUri) {
    logger.error('Invalid GitHub configuration');
    return res.status(500).json({ error: 'Invalid server configuration' });
  }
  next();
};

module.exports = { authenticateToken, validateGithubConfig };