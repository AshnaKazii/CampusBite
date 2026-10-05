const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Cafe = require('../models/Cafe');
const { calculateEstimatedReadyTime } = require('../services/orderTimingService');

exports.createOrder = async (req, res) => {
    try {
        const { items, pickupType, pickupDate, pickupTime, specialInstructions } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const cafe = await Cafe.findOne();
        if (!cafe || !cafe.isOpen) {
            return res.status(400).json({ message: 'Cafe is currently closed' });
        }

        let totalAmount = 0;
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const food = await FoodItem.findById(item.foodId);
            if (!food || !food.available) {
                return res.status(400).json({ message: `Item ${item.name} is unavailable or not found` });
            }

            const itemSubtotal = food.price * item.quantity;
            subtotal += itemSubtotal;

            orderItems.push({
                foodId: food._id,
                name: food.name,
                price: food.price,
                quantity: item.quantity,
                preparationTime: food.preparationTime,
                subtotal: itemSubtotal
            });
        }

        totalAmount = subtotal + (subtotal * 0.05); // 5% tax mockup

        const { estimatedReadyTime } = calculateEstimatedReadyTime(orderItems);

        // Generate Order Number
        const lastOrder = await Order.findOne().sort({ createdAt: -1 });
        let nextNum = 1001;
        if (lastOrder && lastOrder.orderNumber.startsWith('LB')) {
            nextNum = parseInt(lastOrder.orderNumber.replace('LB', '')) + 1;
        }

        const order = new Order({
            orderNumber: `LB${nextNum}`,
            userId: req.user._id,
            cafeId: cafe._id,
            items: orderItems,
            subtotal,
            totalAmount,
            pickupType,
            pickupDate,
            pickupTime,
            estimatedReadyTime,
            specialInstructions
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.userId.toString() !== req.user._id.toString() && !['admin', 'cafe_staff'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CAFE STAFF
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.orderStatus = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (!['PLACED', 'ACCEPTED'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Order cannot be cancelled because preparation has already started.' });
        }

        order.orderStatus = 'CANCELLED';
        const updatedOrder = await order.save();

        res.json({ message: 'Order cancelled successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
