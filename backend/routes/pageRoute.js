const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const authCheck = require('../middleware/authCheck');

router
    .route('/:id')
    .get(pageController.getPage)
    .delete(authCheck, pageController.deletePage)

router.delete('/pending/:ids',authCheck, pageController.deletePendingPages)
router.post('/',authCheck, pageController.createPage);
router.put('/rateLevel',authCheck, pageController.rateLevel);
router.put('/rateText',authCheck, pageController.rateText);


module.exports = router;