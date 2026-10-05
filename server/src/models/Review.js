const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' }
}, { timestamps: true });

// Prevent multiple reviews for same order+food by same user
reviewSchema.index({ userId: 1, foodId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
