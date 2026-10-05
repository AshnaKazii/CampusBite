const express = require('express');
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// General user routes
router.post('/', requireAuth, createOrder);
router.get('/my', requireAuth, getMyOrders);
router.get('/:id', requireAuth, getOrderById);
router.patch('/:id/cancel', requireAuth, cancelOrder);

// Staff/Admin routes
router.get('/', requireAuth, requireRole('staff', 'cafe_staff', 'admin'), getAllOrders);
router.put('/:id/status', requireAuth, requireRole('staff', 'cafe_staff', 'admin'), updateOrderStatus);

module.exports = router;
