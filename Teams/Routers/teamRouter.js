const express = require('express');
const router = express.Router();
const authController = require('../Controller/TeamController');


router.post('/Tech-Team', authController.formTeam);
router.post('/assign', authController.assignIncidentToTeam);
router.get('/Teams', authController.displayTeams);
router.get('/Teams/:id', authController.getTeamById);


module.exports = router;