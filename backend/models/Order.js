const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["Pending", "Preparing", "Ready", "Delivered"],
            default: "Pending",
        },
        orderType: {
            type: String,
            enum: ["dine-in", "pre-order"],
            default: "dine-in",
        },
        diningDate: {
            type: String,
            default: "",
        },
        diningTime: {
            type: String,
            default: "",
        },
        tableNumber: {
            type: Number,
            default: 0,
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "refunded"],
            default: "unpaid",
        },
        paymentMethod: {
            type: String,
            enum: ["card", "cash", "none"],
            default: "none",
        },
        paymentId: {
            type: String,
            default: "",
        },
        customerNote: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
