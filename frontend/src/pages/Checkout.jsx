import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiOutlineCreditCard,
    HiOutlineClock,
    HiOutlineCalendar,
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlineCheck,
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: pickup details, 2: payment, 3: confirmation
    const [loading, setLoading] = useState(false);
    const [orderResult, setOrderResult] = useState(null);

    const [pickupDetails, setPickupDetails] = useState({
        pickupDate: '',
        pickupTime: '',
        customerNote: '',
    });

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiry: '',
        cvv: '',
    });

    const today = new Date().toISOString().split('T')[0];

    const pickupSlots = [
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
    ];

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/.{1,4}/g);
        return matches ? matches.join(' ').slice(0, 19) : v;
    };

    // Format expiry as MM/YY
    const formatExpiry = (value) => {
        const v = value.replace(/[^0-9]/g, '');
        if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
        return v;
    };

    const handlePickupNext = (e) => {
        e.preventDefault();
        if (!pickupDetails.pickupDate || !pickupDetails.pickupTime) {
            toast.error('Please select pickup date and time');
            return;
        }
        setStep(2);
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        // Basic card validation
        const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
        if (cardNum.length < 16) {
            toast.error('Please enter a valid card number');
            return;
        }
        if (!cardDetails.cardHolder.trim()) {
            toast.error('Please enter cardholder name');
            return;
        }
        if (cardDetails.expiry.length < 5) {
            toast.error('Please enter a valid expiry date');
            return;
        }
        if (cardDetails.cvv.length < 3) {
            toast.error('Please enter a valid CVV');
            return;
        }

        setLoading(true);

        try {
            // Simulate payment processing delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const orderItems = cartItems.map((item) => ({
                menuItem: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            }));

            const { data } = await API.post('/orders', {
                items: orderItems,
                totalAmount: cartTotal,
                orderType: 'pre-order',
                pickupDate: pickupDetails.pickupDate,
                pickupTime: pickupDetails.pickupTime,
                paymentMethod: 'card',
                customerNote: pickupDetails.customerNote,
            });

            setOrderResult(data);
            clearCart();
            setStep(3);

            toast.success('Payment successful! Order confirmed.', {
                style: {
                    background: '#1a1a2e',
                    color: '#fefcf7',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                },
                iconTheme: { primary: '#22c55e', secondary: '#1a1a2e' },
                duration: 4000,
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Redirect if cart is empty and not on confirmation step
    if (cartItems.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-10">
                    {['Pickup Details', 'Payment', 'Confirmation'].map((label, i) => (
                        <div key={label} className="flex items-center">
                            <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-gold-400' : 'text-charcoal-500'}`}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i + 1 < step
                                            ? 'bg-green-500 text-white'
                                            : i + 1 === step
                                                ? 'bg-gold-500 text-charcoal-900'
                                                : 'bg-charcoal-700 text-charcoal-400'
                                        }`}
                                >
                                    {i + 1 < step ? <HiOutlineCheck className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className="hidden sm:inline text-sm font-medium">{label}</span>
                            </div>
                            {i < 2 && (
                                <div className={`w-12 sm:w-20 h-0.5 mx-2 ${i + 1 < step ? 'bg-green-500' : 'bg-charcoal-700'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Pickup Details */}
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="card p-6 sm:p-8">
                            <h2 className="text-2xl font-display font-bold text-cream-50 mb-6">
                                <HiOutlineClock className="inline w-6 h-6 text-gold-500 mr-2" />
                                When would you like to pick up?
                            </h2>

                            <form onSubmit={handlePickupNext} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-charcoal-300 mb-1">
                                        <HiOutlineCalendar className="inline w-4 h-4 mr-1" />
                                        Pickup Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={today}
                                        className="input-field"
                                        value={pickupDetails.pickupDate}
                                        onChange={(e) => setPickupDetails({ ...pickupDetails, pickupDate: e.target.value })}
                                        id="checkout-pickup-date"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-charcoal-300 mb-2">
                                        <HiOutlineClock className="inline w-4 h-4 mr-1" />
                                        Pickup Time
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {pickupSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setPickupDetails({ ...pickupDetails, pickupTime: slot })}
                                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${pickupDetails.pickupTime === slot
                                                        ? 'bg-gold-500 text-charcoal-900 shadow-lg shadow-gold-500/25'
                                                        : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700 hover:text-cream-50'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-charcoal-300 mb-1">Special Instructions (Optional)</label>
                                    <textarea
                                        rows={3}
                                        className="input-field resize-none"
                                        placeholder="Any dietary requirements, allergies, or special requests..."
                                        value={pickupDetails.customerNote}
                                        onChange={(e) => setPickupDetails({ ...pickupDetails, customerNote: e.target.value })}
                                        id="checkout-note"
                                    />
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-charcoal-700/30 pt-4">
                                    <h4 className="text-sm font-semibold text-charcoal-300 mb-3">Order Summary</h4>
                                    <div className="space-y-2 mb-3">
                                        {cartItems.map((item) => (
                                            <div key={item._id} className="flex justify-between text-sm">
                                                <span className="text-charcoal-200">{item.name} × {item.quantity}</span>
                                                <span className="text-cream-50">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t border-charcoal-700/30 pt-3">
                                        <span className="text-cream-50">Total</span>
                                        <span className="text-gold-400">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full btn-primary py-3 text-lg"
                                    id="pickup-next-btn"
                                >
                                    Continue to Payment →
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="card p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-display font-bold text-cream-50">
                                    <HiOutlineCreditCard className="inline w-6 h-6 text-gold-500 mr-2" />
                                    Payment Details
                                </h2>
                                <div className="flex items-center gap-1 text-green-400 text-xs">
                                    <HiOutlineLockClosed className="w-3.5 h-3.5" />
                                    <span>Secure</span>
                                </div>
                            </div>

                            {/* Payment summary bar */}
                            <div className="bg-charcoal-800/80 rounded-lg p-4 mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-charcoal-300 text-sm">Pickup on</p>
                                    <p className="text-cream-50 font-semibold">
                                        {pickupDetails.pickupDate} at {pickupDetails.pickupTime}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-charcoal-300 text-sm">Amount</p>
                                    <p className="text-gold-400 font-display text-xl font-bold">${cartTotal.toFixed(2)}</p>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-charcoal-300 mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={19}
                                        className="input-field font-mono tracking-wider"
                                        placeholder="4242 4242 4242 4242"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) =>
                                            setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })
                                        }
                                        id="card-number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-charcoal-300 mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="John Doe"
                                        value={cardDetails.cardHolder}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                                        id="card-holder"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-charcoal-300 mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={5}
                                            className="input-field font-mono"
                                            placeholder="MM/YY"
                                            value={cardDetails.expiry}
                                            onChange={(e) =>
                                                setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })
                                            }
                                            id="card-expiry"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-charcoal-300 mb-1">CVV</label>
                                        <input
                                            type="password"
                                            required
                                            maxLength={4}
                                            className="input-field font-mono"
                                            placeholder="•••"
                                            value={cardDetails.cvv}
                                            onChange={(e) =>
                                                setCardDetails({
                                                    ...cardDetails,
                                                    cvv: e.target.value.replace(/[^0-9]/g, ''),
                                                })
                                            }
                                            id="card-cvv"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-charcoal-400 text-xs bg-charcoal-800/50 rounded-lg p-3">
                                    <HiOutlineShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>Your payment information is encrypted and secure. We never store your card details.</span>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn-secondary flex-1 py-3"
                                    >
                                        ← Back
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex-[2] py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                        id="pay-now-btn"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <HiOutlineLockClosed className="w-4 h-4" />
                                                Pay ${cartTotal.toFixed(2)}
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && orderResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="card p-8 sm:p-10">
                            {/* Success animation */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                            >
                                <HiOutlineCheck className="w-10 h-10 text-green-400" />
                            </motion.div>

                            <h2 className="text-3xl font-display font-bold text-cream-50 mb-2">
                                Payment Successful!
                            </h2>
                            <p className="text-charcoal-300 mb-8">
                                Your pre-order has been confirmed. We'll have it ready for you!
                            </p>

                            {/* Order details */}
                            <div className="bg-charcoal-800/50 rounded-xl p-6 text-left mb-8 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Order ID</span>
                                    <span className="text-cream-50 font-mono text-sm">
                                        #{orderResult._id.slice(-8).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Payment ID</span>
                                    <span className="text-green-400 font-mono text-sm">{orderResult.paymentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Pickup Date</span>
                                    <span className="text-cream-50">{orderResult.pickupDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Pickup Time</span>
                                    <span className="text-cream-50 font-semibold">{orderResult.pickupTime}</span>
                                </div>
                                <div className="border-t border-charcoal-700/30 pt-3">
                                    <h4 className="text-charcoal-400 text-sm mb-2">Items</h4>
                                    {orderResult.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm mb-1">
                                            <span className="text-charcoal-200">{item.name} × {item.quantity}</span>
                                            <span className="text-cream-50">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-charcoal-700/30 pt-3 flex justify-between">
                                    <span className="text-cream-50 font-bold text-lg">Total Paid</span>
                                    <span className="text-gold-400 font-display text-2xl font-bold">
                                        ${orderResult.totalAmount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Payment Status</span>
                                    <span className="badge badge-confirmed">Paid</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => navigate('/orders')} className="btn-primary flex-1 py-3">
                                    View My Orders
                                </button>
                                <button onClick={() => navigate('/menu')} className="btn-secondary flex-1 py-3">
                                    Order More
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
