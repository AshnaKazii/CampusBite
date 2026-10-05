const express = require('express');
const { getCafe, updateCafe } = require('../controllers/cafeController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCafe);
router.put('/', requireAuth, requireRole('staff', 'admin', 'cafe_staff'), updateCafe);

module.exports = router;
