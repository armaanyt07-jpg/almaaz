const express = require("express");
const router = express.Router();
const {
    createReservation,
    getMyReservations,
    getAllReservations,
    cancelReservation,
} = require("../controllers/reservationController");
const { protect, admin } = require("../middleware/authMiddleware");

router
    .route("/")
    .post(protect, createReservation)
    .get(protect, admin, getAllReservations);
router.get("/mine", protect, getMyReservations);
router.put("/:id/cancel", protect, cancelReservation);

module.exports = router;
