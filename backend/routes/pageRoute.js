const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const authCheck = require('../middleware/authCheck');

router
    .route('/:id')
    .get(pageController.getPage)
    .delete(authCheck, pageController.deletePage)

router.
    route('/pending/:ids')
    .delete(authCheck, pageController.deletePendingPages)

router
    .route('/')
    .post(authCheck, pageController.createPage);

router
    .route('/rateLevel')
    .put(authCheck, pageController.rateLevel);

router
    .route('/rateText')
    .put(authCheck, pageController.rateText);


module.exports = router;