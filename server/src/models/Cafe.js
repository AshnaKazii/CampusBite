const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'La Roche Cafe' },
    description: { type: String },
    location: { type: String, default: 'Shah & Anchor Kutchhi Engineering College' },
    image: { type: String },
    openingTime: { type: String, default: '08:00' },
    closingTime: { type: String, default: '18:00' },
    isOpen: { type: Boolean, default: true },
    contactInfo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Cafe', cafeSchema);
