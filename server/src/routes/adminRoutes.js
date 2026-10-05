const express = require('express');
const { getStatistics, getUsers } = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth, requireRole('staff', 'admin', 'cafe_staff'));

router.get('/statistics', getStatistics);
router.get('/users', getUsers);

module.exports = router;
