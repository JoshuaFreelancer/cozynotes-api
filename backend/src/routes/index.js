const express = require('express');
const router = express.Router();

// Importing all my specific route modules
const authRoutes = require('./authRoutes');
const noteRoutes = require('./noteRoutes');

// I like to aggregate all routes here to keep app.js completely clean.
// Every route here will automatically be prefixed with whatever I set in app.js.
router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);

module.exports = router;