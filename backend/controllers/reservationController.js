const Reservation = require("../models/Reservation");

// POST /api/reservations
const createReservation = async (req, res) => {
    try {
        const { name, email, phone, date, time, guests } = req.body;

        if (!name || !email || !phone || !date || !time || !guests) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const reservation = new Reservation({
            user: req.user._id,
            name,
            email,
            phone,
            date,
            time,
            guests,
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// GET /api/reservations/mine
const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/reservations (Admin)
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/reservations/:id/cancel
const cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Allow only the owner or admin to cancel
        if (
            reservation.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "Not authorized to cancel this reservation" });
        }

        reservation.status = "Cancelled";
        await reservation.save();
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReservation,
    getMyReservations,
    getAllReservations,
    cancelReservation,
};
