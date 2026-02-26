const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Please provide your name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Please provide your phone number"],
            trim: true,
        },
        date: {
            type: String,
            required: [true, "Please provide a reservation date"],
        },
        time: {
            type: String,
            required: [true, "Please provide a reservation time"],
        },
        guests: {
            type: Number,
            required: [true, "Please provide number of guests"],
            min: 1,
            max: 20,
        },
        status: {
            type: String,
            enum: ["Confirmed", "Cancelled"],
            default: "Confirmed",
        },
    },
    { timestamps: true }
);

// Prevent double booking: check before save
reservationSchema.pre("save", async function (next) {
    if (this.isNew) {
        const existing = await mongoose.model("Reservation").findOne({
            date: this.date,
            time: this.time,
            status: "Confirmed",
        });
        if (existing) {
            const err = new Error(
                "This time slot is already booked. Please choose a different time."
            );
            err.statusCode = 400;
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
