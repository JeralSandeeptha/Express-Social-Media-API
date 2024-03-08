const express = require('express');
const {
    registerAdmin,
    loginAdmin,
    getAdmin,
    getAllAdmins,
    deleteAdmin,
    updateAdmin
} = require('../controllers/adminController');

const router = express.Router();

router.post('/', registerAdmin);
router.post('/login', loginAdmin);
router.get('/', getAllAdmins);
router.get('/:adminId', getAdmin);
router.put('/:adminId', updateAdmin);
router.delete('/:adminId', deleteAdmin);

module.exports = router;