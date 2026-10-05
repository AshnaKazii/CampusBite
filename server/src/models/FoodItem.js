const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String, default: '' },
    preparationTime: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: true },
    cafeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
