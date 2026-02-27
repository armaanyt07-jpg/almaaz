import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please sign in to place an order');
            navigate('/login');
            return;
        }

        try {
            const orderItems = cartItems.map((item) => ({
                menuItem: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            }));

            await API.post('/orders', {
                items: orderItems,
                totalAmount: cartTotal,
            });

            clearCart();
            toast.success('Order placed successfully!', {
                style: {
                    background: '#1a1a2e',
                    color: '#fefcf7',
                    border: '1px solid rgba(224, 169, 109, 0.3)',
                },
                iconTheme: { primary: '#22c55e', secondary: '#1a1a2e' },
            });
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <HiOutlineShoppingBag className="w-20 h-20 text-charcoal-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-semibold text-cream-50 mb-2">Your cart is empty</h2>
                    <p className="text-charcoal-400 mb-6">Add some delicious items from our menu!</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="btn-primary"
                    >
                        Browse Menu
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="section-heading mb-8">Your Cart</h1>

                    {/* Cart Items */}
                    <div className="space-y-4 mb-8">
                        {cartItems.map((item) => (
                            <CartItem key={item._id} item={item} />
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="card p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-charcoal-300">Subtotal</span>
                            <span className="text-cream-50 font-semibold">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-charcoal-700/50 pt-4 flex items-center justify-between mb-6">
                            <span className="text-cream-50 font-display text-xl font-bold">Total</span>
                            <span className="text-gold-400 font-display text-2xl font-bold">
                                ${cartTotal.toFixed(2)}
                            </span>
                        </div>

                        {/* Pre-Order & Pay */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (!user) {
                                    toast.error('Please sign in to place an order');
                                    navigate('/login');
                                    return;
                                }
                                navigate('/checkout');
                            }}
                            className="w-full btn-primary text-lg py-4 mb-3 flex items-center justify-center gap-2"
                            id="preorder-pay-btn"
                        >
                            🍽️ Pre-Order & Pay Now
                        </motion.button>

                        {/* Dine-in (pay at restaurant) */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCheckout}
                            className="w-full btn-secondary py-3 text-sm"
                            id="checkout-btn"
                        >
                            Order & Pay at Restaurant
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Cart;
