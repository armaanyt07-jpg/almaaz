import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUsers } from 'react-icons/hi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Reservations = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
    });

    const timeSlots = [
        '12:00', '12:30', '13:00', '13:30', '14:00',
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
    ];

    useEffect(() => {
        if (user) fetchReservations();
    }, [user]);

    const fetchReservations = async () => {
        try {
            const { data } = await API.get('/reservations/mine');
            setReservations(data);
        } catch (error) {
            console.error('Failed to fetch reservations');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please sign in to make a reservation');
            return;
        }

        setLoading(true);
        try {
            await API.post('/reservations', form);
            toast.success('Table reserved successfully!', {
                style: {
                    background: '#1a1a2e',
                    color: '#fefcf7',
                    border: '1px solid rgba(224, 169, 109, 0.3)',
                },
                iconTheme: { primary: '#22c55e', secondary: '#1a1a2e' },
            });
            setForm({ ...form, phone: '', date: '', time: '', guests: 2 });
            fetchReservations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reserve table');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            await API.put(`/reservations/${id}/cancel`);
            toast.success('Reservation cancelled');
            fetchReservations();
        } catch (error) {
            toast.error('Failed to cancel reservation');
        }
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="section-heading">Reserve a Table</h1>
                    <p className="section-subheading mx-auto mt-3">
                        Secure your spot for an unforgettable dining experience.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Booking Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                            <h3 className="text-xl font-display font-semibold text-cream-50">Booking Details</h3>

                            <div>
                                <label className="block text-sm text-charcoal-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your name"
                                    id="reservation-name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-charcoal-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    id="reservation-email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-charcoal-300 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="input-field"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+1 (555) 123-4567"
                                    id="reservation-phone"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-charcoal-300 mb-1">
                                        <HiOutlineCalendar className="inline w-4 h-4 mr-1" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={today}
                                        className="input-field"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        id="reservation-date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-charcoal-300 mb-1">
                                        <HiOutlineClock className="inline w-4 h-4 mr-1" />
                                        Time
                                    </label>
                                    <select
                                        required
                                        className="select-field"
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        id="reservation-time"
                                    >
                                        <option value="">Select time</option>
                                        {timeSlots.map((slot) => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-charcoal-300 mb-1">
                                    <HiOutlineUsers className="inline w-4 h-4 mr-1" />
                                    Number of Guests
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="20"
                                    className="input-field"
                                    value={form.guests}
                                    onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })}
                                    id="reservation-guests"
                                />
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 disabled:opacity-50"
                                id="reserve-btn"
                            >
                                {loading ? 'Reserving...' : 'Reserve Table'}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* My Reservations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-xl font-display font-semibold text-cream-50 mb-4">Your Reservations</h3>
                        {!user ? (
                            <div className="card p-6 text-center">
                                <p className="text-charcoal-400">Sign in to see your reservations</p>
                            </div>
                        ) : reservations.length === 0 ? (
                            <div className="card p-6 text-center">
                                <p className="text-charcoal-400">No reservations yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reservations.map((res) => (
                                    <div key={res._id} className="card p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-cream-50 font-semibold">{res.date} at {res.time}</p>
                                                <p className="text-charcoal-300 text-sm">{res.guests} guests</p>
                                            </div>
                                            <span className={`badge ${res.status === 'Confirmed' ? 'badge-confirmed' : 'badge-cancelled'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </div>
                                        {res.status === 'Confirmed' && (
                                            <button
                                                onClick={() => handleCancel(res._id)}
                                                className="text-sm text-red-400 hover:text-red-300 mt-2 transition-colors"
                                            >
                                                Cancel Reservation
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
