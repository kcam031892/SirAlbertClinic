const express = require('express');

const protectRoute = require('./../middlewares/protectRoute');

const router = express.Router();

router.get('/dashboard', protectRoute, (req, res) => {
  res.render('dashboard');
});

module.exports = router;
