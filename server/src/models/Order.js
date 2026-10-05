const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    preparationTime: { type: Number, required: true },
    subtotal: { type: Number, required: true, min: 0 }
});

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cafeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    pickupType: { type: String, enum: ['ASAP', 'SCHEDULED'], required: true },
    pickupDate: { type: Date },
    pickupTime: { type: String },
    estimatedReadyTime: { type: Date },

    orderStatus: { type: String, enum: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'], default: 'PLACED' },
    paymentMethod: { type: String, default: 'PAY_AT_CAFE' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },

    specialInstructions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
