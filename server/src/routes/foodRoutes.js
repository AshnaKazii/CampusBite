const express = require('express');
const { getFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);

router.post('/', requireAuth, requireRole('staff', 'cafe_staff', 'admin'), createFood);
router.put('/:id', requireAuth, requireRole('staff', 'cafe_staff', 'admin'), updateFood);
router.delete('/:id', requireAuth, requireRole('staff', 'cafe_staff', 'admin'), deleteFood);

module.exports = router;
