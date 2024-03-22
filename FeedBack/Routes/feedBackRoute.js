const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/feedBackController.js')


router.post('/submit-FeedBack', feedbackController.submitFeedBack);
router.get('/feedbacks',feedbackController.getFeedBack);
 
module.exports = router ; 