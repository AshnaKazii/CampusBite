require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Cafe = require('../models/Cafe');
const Category = require('../models/Category');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const Review = require('../models/Review');

const connectDB = async () => {
    let uri = process.env.MONGODB_URI;
    if (process.env.USE_IN_MEMORY_DB === 'true') {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        console.log("USING IN-MEMORY MONGODB FOR SEEDING");
    }
    await mongoose.connect(uri);
    console.log('MongoDB Connected for Seeding');
};

const foodsList = [
    { name: 'Masala Maggi', price: 50, prep: 10, cat: 'Maggi & Noodles' },
    { name: 'Cheese Maggi', price: 70, prep: 10, cat: 'Maggi & Noodles' },
    { name: 'Masala Cheese Maggi', price: 80, prep: 12, cat: 'Maggi & Noodles' },
    { name: 'Bread Butter', price: 35, prep: 5, cat: 'Breakfast' },
    { name: 'Bread Butter Jam', price: 45, prep: 5, cat: 'Breakfast' },
    { name: 'Veg Grilled Sandwich', price: 70, prep: 10, cat: 'Breakfast' },
    { name: 'Cheese Grilled Sandwich', price: 90, prep: 10, cat: 'Breakfast' },
    { name: 'Veg Cheese Toast', price: 80, prep: 10, cat: 'Breakfast' },
    { name: 'Vada Pav', price: 25, prep: 5, cat: 'Vada Pav & Quick Bites' },
    { name: 'Cheese Vada Pav', price: 40, prep: 5, cat: 'Vada Pav & Quick Bites' },
    { name: 'Samosa', price: 20, prep: 5, cat: 'Vada Pav & Quick Bites' },
    { name: 'Samosa Pav', price: 30, prep: 5, cat: 'Vada Pav & Quick Bites' },
    { name: 'Kachori', price: 25, prep: 5, cat: 'Vada Pav & Quick Bites' },
    { name: 'Veg Puff', price: 35, prep: 5, cat: 'Vada Pav & Quick Bites' },
    { name: 'Cheese Corn Puff', price: 50, prep: 7, cat: 'Vada Pav & Quick Bites' },
    { name: 'French Fries', price: 70, prep: 8, cat: 'Vada Pav & Quick Bites' },
    { name: 'Peri Peri Fries', price: 85, prep: 8, cat: 'Vada Pav & Quick Bites' },
    { name: 'Veg Sandwich', price: 60, prep: 8, cat: 'Sandwiches' },
    { name: 'Cheese Sandwich', price: 75, prep: 8, cat: 'Sandwiches' },
    { name: 'Veg Cheese Sandwich', price: 85, prep: 10, cat: 'Sandwiches' },
    { name: 'Club Sandwich', price: 110, prep: 12, cat: 'Sandwiches' },
    { name: 'Schezwan Sandwich', price: 90, prep: 10, cat: 'Sandwiches' },
    { name: 'Paneer Sandwich', price: 100, prep: 12, cat: 'Sandwiches' },
    { name: 'Veg Burger', price: 80, prep: 10, cat: 'Burgers' },
    { name: 'Cheese Veg Burger', price: 100, prep: 12, cat: 'Burgers' },
    { name: 'Paneer Burger', price: 120, prep: 12, cat: 'Burgers' },
    { name: 'Schezwan Burger', price: 110, prep: 12, cat: 'Burgers' },
    { name: 'Margherita Pizza', price: 120, prep: 15, cat: 'Pizza' },
    { name: 'Veg Cheese Pizza', price: 140, prep: 15, cat: 'Pizza' },
    { name: 'Paneer Pizza', price: 160, prep: 18, cat: 'Pizza' },
    { name: 'Corn & Cheese Pizza', price: 140, prep: 15, cat: 'Pizza' },
    { name: 'Schezwan Maggi', price: 70, prep: 10, cat: 'Maggi & Noodles' },
    { name: 'Veg Hakka Noodles', price: 100, prep: 12, cat: 'Maggi & Noodles' },
    { name: 'Schezwan Noodles', price: 110, prep: 12, cat: 'Maggi & Noodles' },
    { name: 'Paneer Noodles', price: 130, prep: 15, cat: 'Maggi & Noodles' },
    { name: 'Veg Grilled Wrap', price: 100, prep: 12, cat: 'Meals / Heavier Food' },
    { name: 'Paneer Wrap', price: 120, prep: 15, cat: 'Meals / Heavier Food' },
    { name: 'Veg Cheese Pasta', price: 120, prep: 15, cat: 'Meals / Heavier Food' },
    { name: 'Red Sauce Pasta', price: 110, prep: 15, cat: 'Meals / Heavier Food' },
    { name: 'White Sauce Pasta', price: 130, prep: 15, cat: 'Meals / Heavier Food' },
    { name: 'Cutting Chai', price: 15, prep: 3, cat: 'Tea & Coffee' },
    { name: 'Regular Tea', price: 20, prep: 3, cat: 'Tea & Coffee' },
    { name: 'Masala Tea', price: 25, prep: 4, cat: 'Tea & Coffee' },
    { name: 'Black Tea', price: 20, prep: 3, cat: 'Tea & Coffee' },
    { name: 'Regular Coffee', price: 30, prep: 5, cat: 'Tea & Coffee' },
    { name: 'Cold Coffee', price: 60, prep: 5, cat: 'Tea & Coffee' },
    { name: 'Cold Coffee with Ice Cream', price: 90, prep: 7, cat: 'Tea & Coffee' },
    { name: 'Lemonade', price: 40, prep: 3, cat: 'Cold Drinks' },
    { name: 'Masala Lemonade', price: 50, prep: 3, cat: 'Cold Drinks' },
    { name: 'Fresh Lime Soda', price: 50, prep: 3, cat: 'Cold Drinks' },
    { name: 'Mango Milkshake', price: 70, prep: 7, cat: 'Cold Drinks' },
    { name: 'Chocolate Milkshake', price: 80, prep: 7, cat: 'Cold Drinks' },
    { name: 'Strawberry Milkshake', price: 80, prep: 7, cat: 'Cold Drinks' },
    { name: 'Chocolate Brownie', price: 60, prep: 3, cat: 'Desserts' },
    { name: 'Brownie with Ice Cream', price: 90, prep: 5, cat: 'Desserts' },
    { name: 'Chocolate Pastry', price: 60, prep: 3, cat: 'Desserts' },
    { name: 'Ice Cream Cup', price: 40, prep: 2, cat: 'Desserts' }
];

const seedData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Review.deleteMany();
        await FoodItem.deleteMany();
        await Category.deleteMany();
        await Cafe.deleteMany();
        await User.deleteMany();

        const cafe = await Cafe.create({
            name: 'La Roche Cafe',
            description: 'Campus Cafe for SAKEC',
            location: 'Shah & Anchor Kutchhi Engineering College'
        });

        await User.create([
            { name: 'Staff User', email: 'staff@laroche.local', password: 'password123', role: 'staff' },
            { name: 'Student 1', email: 'student@laroche.local', password: 'password123', role: 'student', studentId: 'SAK123' }
        ]);

        const catMap = {};
        const categories = [...new Set(foodsList.map(f => f.cat))];
        for (const catName of categories) {
            const cat = await Category.create({ name: catName, isActive: true });
            catMap[catName] = cat._id;
        }

        for (const f of foodsList) {
            await FoodItem.create({
                name: f.name,
                price: f.price,
                preparationTime: f.prep,
                category: catMap[f.cat],
                cafeId: cafe._id,
                description: 'Delicious ' + f.name,
                available: true,
                isVegetarian: true
            });
        }

        console.log('Database Seeded Successfully!');

        // If we are using Memory DB, it will automatically shut down
        // If not using Memory DB, process.exit(0) is needed
        if (process.env.USE_IN_MEMORY_DB !== 'true') {
            process.exit(0);
        }
    } catch (error) {
        console.error(error);
        if (process.env.USE_IN_MEMORY_DB !== 'true') process.exit(1);
    }
};

seedData();
