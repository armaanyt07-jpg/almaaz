const express = require("express");
const router = express.Router();
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getAvailableTables,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, placeOrder).get(protect, admin, getAllOrders);
router.get("/tables", protect, getAvailableTables);
router.get("/mine", protect, getMyOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
