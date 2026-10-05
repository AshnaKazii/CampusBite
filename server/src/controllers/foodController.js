const FoodItem = require('../models/FoodItem');

exports.getFoods = async (req, res) => {
    try {
        const query = {};
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.available === 'true') {
            query.available = true;
        }

        const foods = await FoodItem.find(query).populate('category', 'name').exec();
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFoodById = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id).populate('category', 'name');
        if (!food) return res.status(404).json({ message: 'Food item not found' });
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Staff/Admin functions
exports.createFood = async (req, res) => {
    try {
        const food = new FoodItem(req.body);
        const createdFood = await food.save();
        res.status(201).json(createdFood);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food item not found' });

        Object.assign(food, req.body);
        const updatedFood = await food.save();
        res.json(updatedFood);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food item not found' });

        await food.deleteOne();
        res.json({ message: 'Food removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
