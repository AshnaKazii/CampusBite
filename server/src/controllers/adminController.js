const User = require('../models/User');
const Order = require('../models/Order');

exports.getStatistics = async (req, res) => {
    try {
        const FoodItem = require('../models/FoodItem');

        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalMenuItems = await FoodItem.countDocuments();
        const availableMenuItems = await FoodItem.countDocuments({ available: true });
        const outOfStockItems = await FoodItem.countDocuments({ available: false });

        // Very basic simple stats
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const ordersToday = await Order.find({ createdAt: { $gte: startOfDay } });

        const pending = ordersToday.filter(o => o.orderStatus === 'PLACED' || o.orderStatus === 'ACCEPTED').length;
        const preparing = ordersToday.filter(o => o.orderStatus === 'PREPARING').length;
        const ready = ordersToday.filter(o => o.orderStatus === 'READY').length;
        const completed = ordersToday.filter(o => o.orderStatus === 'COLLECTED').length;
        const cancelled = ordersToday.filter(o => o.orderStatus === 'CANCELLED').length;

        // Sales should be calculated from actual order data... count only successful/completed orders
        const revenueToday = ordersToday.filter(o => o.orderStatus === 'COLLECTED').reduce((acc, curr) => acc + curr.totalAmount, 0);

        res.json({
            totalStudents,
            totalMenuItems,
            availableMenuItems,
            outOfStockItems,
            ordersToday: ordersToday.length,
            pending,
            preparing,
            ready,
            completed,
            cancelled,
            revenueToday
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
