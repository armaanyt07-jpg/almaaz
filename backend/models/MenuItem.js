const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide item name"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please provide item description"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Please provide item price"],
            min: 0,
        },
        category: {
            type: String,
            required: [true, "Please provide item category"],
            enum: ["Starters", "Mains", "Desserts", "Beverages", "Specials"],
        },
        image: {
            type: String,
            default: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Al-Maaz",
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
