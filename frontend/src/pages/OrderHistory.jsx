import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClipboardList } from 'react-icons/hi';
import API from '../api/axios';

const statusBadge = (status) => {
    const map = {
        Pending: 'badge-pending',
        Preparing: 'badge-preparing',
        Ready: 'badge-ready',
        Delivered: 'badge-delivered',
    };
    return map[status] || 'badge-pending';
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/mine');
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="section-heading mb-8">My Orders</h1>

                    {orders.length === 0 ? (
                        <div className="text-center py-20">
                            <HiOutlineClipboardList className="w-16 h-16 text-charcoal-600 mx-auto mb-4" />
                            <p className="text-charcoal-400 text-lg">No orders yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, i) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="card p-5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                        <div>
                                            <p className="text-xs text-charcoal-400 font-mono">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="text-sm text-charcoal-300">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {order.orderType === 'pre-order' && (
                                                <span className="badge bg-purple-500/20 text-purple-400">Pre-Order</span>
                                            )}
                                            {order.paymentStatus === 'paid' && (
                                                <span className="badge badge-confirmed">💳 Paid</span>
                                            )}
                                            <span className={`badge ${statusBadge(order.status)}`}>{order.status}</span>
                                            <span className="text-gold-400 font-bold text-lg">
                                                ${order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pickup info for pre-orders */}
                                    {order.orderType === 'pre-order' && order.pickupDate && (
                                        <div className="bg-charcoal-800/50 rounded-lg p-3 mb-3 flex flex-wrap gap-4 text-sm">
                                            <div>
                                                <span className="text-charcoal-400">Pickup: </span>
                                                <span className="text-cream-50 font-medium">{order.pickupDate} at {order.pickupTime}</span>
                                            </div>
                                            {order.paymentId && (
                                                <div>
                                                    <span className="text-charcoal-400">Payment ID: </span>
                                                    <span className="text-green-400 font-mono text-xs">{order.paymentId}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="border-t border-charcoal-700/30 pt-3">
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, j) => (
                                                <span key={j} className="text-sm text-charcoal-300 bg-charcoal-800 px-3 py-1 rounded-full">
                                                    {item.name} × {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default OrderHistory;
