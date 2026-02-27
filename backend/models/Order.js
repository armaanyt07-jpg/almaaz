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
        pickupTime: {
            type: String,
            default: "",
        },
        pickupDate: {
            type: String,
            default: "",
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
        deliveryAddress: {
            type: String,
            default: "Dine-in",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
