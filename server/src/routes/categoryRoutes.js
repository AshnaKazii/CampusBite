const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.post('/', requireAuth, requireRole('staff', 'admin', 'cafe_staff'), createCategory);

module.exports = router;
