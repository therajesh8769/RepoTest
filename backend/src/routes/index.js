const express = require('express');
const authRoutes = require('./authRoutes');
const githubRoutes = require('./githubRoutes');
const aiRoutes = require('./aiRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/github', githubRoutes);
router.use('/ai', aiRoutes);

module.exports = router;