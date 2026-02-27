const Order = require("../models/Order");

const TOTAL_TABLES = 12; // Restaurant has 12 tables

// POST /api/orders
const placeOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            orderType,
            diningDate,
            diningTime,
            tableNumber,
            paymentMethod,
            customerNote,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        // For pre-orders, dining date, time, and table are required
        if (orderType === "pre-order") {
            if (!diningDate || !diningTime) {
                return res
                    .status(400)
                    .json({ message: "Dining date and time are required for pre-orders" });
            }
            if (!tableNumber) {
                return res
                    .status(400)
                    .json({ message: "Please select a table" });
            }

            // Check if table is still available
            const conflict = await Order.findOne({
                orderType: "pre-order",
                diningDate,
                diningTime,
                tableNumber,
                status: { $ne: "Delivered" },
            });
            if (conflict) {
                return res
                    .status(400)
                    .json({ message: "This table is no longer available for the selected time. Please choose another." });
            }
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            orderType: orderType || "dine-in",
            diningDate: diningDate || "",
            diningTime: diningTime || "",
            tableNumber: tableNumber || 0,
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

// GET /api/orders/tables?date=YYYY-MM-DD&time=HH:MM
const getAvailableTables = async (req, res) => {
    try {
        const { date, time } = req.query;

        if (!date || !time) {
            return res
                .status(400)
                .json({ message: "Date and time are required" });
        }

        // Find tables already booked for this date+time
        const bookedOrders = await Order.find({
            orderType: "pre-order",
            diningDate: date,
            diningTime: time,
            status: { $ne: "Delivered" },
        }).select("tableNumber");

        const bookedTables = bookedOrders.map((o) => o.tableNumber);

        // Build table list with availability
        const tables = [];
        for (let i = 1; i <= TOTAL_TABLES; i++) {
            tables.push({
                number: i,
                seats: i <= 4 ? 2 : i <= 8 ? 4 : 6, // Tables 1-4: 2-seater, 5-8: 4-seater, 9-12: 6-seater
                available: !bookedTables.includes(i),
            });
        }

        res.json(tables);
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

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getAvailableTables,
};
