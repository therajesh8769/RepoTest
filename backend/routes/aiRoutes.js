const express = require('express');
const AIService = require('../services/aiService');
const { authenticateToken } = require('../utils/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();
const aiService = new AIService();

router.use(authenticateToken);

router.post('/test-summaries', async (req, res) => {
  try {
    const { files } = req.body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Files array is required' });
    }
    
    const summaries = await aiService.generateTestSummaries(files);
    

// Ensure response is an array
let normalized = summaries;
if (!Array.isArray(summaries)) {
  normalized = [
    {
      title: 'AI output',
      description: typeof summaries === 'string' ? summaries : JSON.stringify(summaries)
    }
  ];
}

res.json(normalized);
  }
  catch (error) {
    logger.error('Failed to generate test summaries', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.post('/test-code', async (req, res) => {
  try {
    const { file, testSummary } = req.body;
    
    if (!file || !testSummary) {
      return res.status(400).json({ error: 'File and test summary are required' });
    }
    
    const testCode = await aiService.generateTestCode(file, testSummary);
    const testFileName = aiService.generateTestFileName(file.path, testSummary);
    console.log('Generated test code:', testCode);
    console.log('Test file name:', testFileName);
    console.log('Original file:', file);
    console.log('Test summary:', testSummary);
    
    res.json({
      testCode,
      testFileName,
      originalFile: file,
      testSummary
    });
  } catch (error) {
    logger.error('Failed to generate test code', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;