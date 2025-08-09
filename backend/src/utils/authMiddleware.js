const { Octokit } = require('@octokit/rest');
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

module.exports = { authenticateToken };