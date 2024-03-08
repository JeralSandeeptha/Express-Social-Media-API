const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, loginUser, registerUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;