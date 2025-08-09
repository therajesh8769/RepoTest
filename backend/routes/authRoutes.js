const express = require('express');
const axios = require('axios');
const { githubConfig } = require('../config/github');
const logger = require('../utils/logger');
const { validateGithubConfig } = require('../utils/authMiddleware');

const router = express.Router();

router.post('/github/exchange', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: githubConfig.clientId,
      client_secret: githubConfig.clientSecret,
      code,
      redirect_uri: githubConfig.redirectUri
    }, {
      headers: {
        Accept: 'application/json'
      }
    });
    
    if (tokenResponse.data.error) {
      logger.error('GitHub OAuth error', { error: tokenResponse.data });
      return res.status(400).json({ error: tokenResponse.data.error_description });
    }
    
    const accessToken = tokenResponse.data.access_token;
    
    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    
    res.json({
      accessToken,
      user: {
        id: userResponse.data.id,
        login: userResponse.data.login,
        name: userResponse.data.name,
        email: userResponse.data.email,
        avatarUrl: userResponse.data.avatar_url
      }
    });
  } catch (error) {
    logger.error('GitHub OAuth exchange failed', { error: error.message });
    res.status(500).json({ error: 'Authentication failed' });
  }
});

router.get('/github/url', validateGithubConfig, (req, res) => {
  try {
    logger.info('Generating GitHub auth URL', { clientId: githubConfig.clientId });
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId}&redirect_uri=${githubConfig.redirectUri}&scope=repo,user:email`;
    
    logger.info('Generated GitHub auth URL', { url: githubAuthUrl });
    res.json({ url: githubAuthUrl });
  } catch (error) {
    logger.error('Failed to generate GitHub auth URL', { error: error.message });
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
});

module.exports = router;