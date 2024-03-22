const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');



router.get('/users/user/:id', authController.getUserById); 
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.get('/users/clients', authController.getClientUsers);
router.get('/users/technicians', authController.getTechnicianUsers);
router.get('/users/chief', authController.getChiefUsers);
router.get('/search', authController.findUser); 
router.get('/search-Tech', authController.searchTechs);
router.post('/Tech-Team', authController.formTeam);
router.get('/Teams', authController.displayTeams);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser); 


module.exports = router;