const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router
.route('/:id')
.get(pageController.getPage)

router
.route('/')
.post(pageController.createPage);

router
.route('/rateLevel')
.put(pageController.rateLevel);

router
.route('/rateText')
.put(pageController.rateText);


module.exports = router;