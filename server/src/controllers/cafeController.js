const Cafe = require('../models/Cafe');

exports.getCafe = async (req, res) => {
    try {
        const cafe = await Cafe.findOne();
        if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
        res.json(cafe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCafe = async (req, res) => {
    try {
        const cafe = await Cafe.findOne();
        if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

        Object.assign(cafe, req.body);
        const updatedCafe = await cafe.save();
        res.json(updatedCafe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
