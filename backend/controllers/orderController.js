const Order = require("../models/Order");

// POST /api/orders
const placeOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            deliveryAddress,
            orderType,
            pickupTime,
            pickupDate,
            paymentMethod,
            customerNote,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        // For pre-orders, pickup date and time are required
        if (orderType === "pre-order" && (!pickupDate || !pickupTime)) {
            return res
                .status(400)
                .json({ message: "Pickup date and time required for pre-orders" });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            deliveryAddress: deliveryAddress || "Dine-in",
            orderType: orderType || "dine-in",
            pickupTime: pickupTime || "",
            pickupDate: pickupDate || "",
            paymentMethod: paymentMethod || "none",
            paymentStatus: paymentMethod === "card" ? "paid" : "unpaid",
            paymentId:
                paymentMethod === "card"
                    ? "PAY_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9)
                    : "",
            customerNote: customerNote || "",
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders/mine
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = req.body.status || order.status;
        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
