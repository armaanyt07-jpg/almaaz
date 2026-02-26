import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import API from '../api/axios';
import toast from 'react-hot-toast';

const tabs = ['Menu Items', 'Orders', 'Reservations'];
const categories = ['Starters', 'Mains', 'Desserts', 'Beverages', 'Specials'];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Menu Items');
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({
        name: '', description: '', price: '', category: 'Starters', image: '', available: true,
    });

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [menuRes, orderRes, resRes] = await Promise.all([
                API.get('/menu'),
                API.get('/orders'),
                API.get('/reservations'),
            ]);
            setMenuItems(menuRes.data);
            setOrders(orderRes.data);
            setReservations(resRes.data);
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // ---- Menu CRUD ----
    const openCreate = () => {
        setEditingItem(null);
        setForm({ name: '', description: '', price: '', category: 'Starters', image: '', available: true });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            available: item.available,
        });
        setShowModal(true);
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, price: parseFloat(form.price) };
            if (editingItem) {
                await API.put(`/menu/${editingItem._id}`, payload);
                toast.success('Item updated');
            } else {
                await API.post('/menu', payload);
                toast.success('Item created');
            }
            setShowModal(false);
            fetchAll();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await API.delete(`/menu/${id}`);
            toast.success('Item deleted');
            fetchAll();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    // ---- Orders ----
    const updateOrderStatus = async (id, status) => {
        try {
            await API.put(`/orders/${id}/status`, { status });
            toast.success(`Status updated to ${status}`);
            fetchAll();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <h1 className="section-heading">Admin Dashboard</h1>
                        <div className="flex gap-2 text-sm">
                            <span className="badge bg-gold-500/20 text-gold-400">{menuItems.length} Items</span>
                            <span className="badge bg-blue-500/20 text-blue-400">{orders.length} Orders</span>
                            <span className="badge bg-green-500/20 text-green-400">{reservations.length} Reservations</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-charcoal-700/30 pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-charcoal-800 text-gold-400 border-b-2 border-gold-500'
                                        : 'text-charcoal-400 hover:text-cream-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Menu Items Tab */}
                    {activeTab === 'Menu Items' && (
                        <div>
                            <button onClick={openCreate} className="btn-primary mb-6 flex items-center gap-2" id="create-menu-item-btn">
                                <HiOutlinePlus className="w-5 h-5" /> Add Menu Item
                            </button>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-charcoal-700/30 text-left">
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Name</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Category</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Price</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Available</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.map((item) => (
                                            <tr key={item._id} className="border-b border-charcoal-800/50 hover:bg-charcoal-800/30 transition-colors">
                                                <td className="py-3 px-4 text-cream-50 font-medium">{item.name}</td>
                                                <td className="py-3 px-4">
                                                    <span className="badge bg-charcoal-700 text-charcoal-200">{item.category}</span>
                                                </td>
                                                <td className="py-3 px-4 text-gold-400 font-semibold">${item.price.toFixed(2)}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`badge ${item.available ? 'badge-confirmed' : 'badge-cancelled'}`}>
                                                        {item.available ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openEdit(item)} className="text-blue-400 hover:text-blue-300 transition-colors">
                                                            <HiOutlinePencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 transition-colors">
                                                            <HiOutlineTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'Orders' && (
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <p className="text-charcoal-400 text-center py-10">No orders yet</p>
                            ) : (
                                orders.map((order) => (
                                    <div key={order._id} className="card p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                            <div>
                                                <p className="text-cream-50 font-semibold">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </p>
                                                <p className="text-charcoal-400 text-sm">
                                                    {order.user?.name || 'Guest'} • {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className="select-field text-sm py-1.5 px-3 w-auto"
                                                >
                                                    {['Pending', 'Preparing', 'Ready', 'Delivered'].map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <span className="text-gold-400 font-bold">${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, j) => (
                                                <span key={j} className="text-xs bg-charcoal-800 text-charcoal-300 px-2 py-1 rounded">
                                                    {item.name} × {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Reservations Tab */}
                    {activeTab === 'Reservations' && (
                        <div className="overflow-x-auto">
                            {reservations.length === 0 ? (
                                <p className="text-charcoal-400 text-center py-10">No reservations yet</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-charcoal-700/30 text-left">
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Guest</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Date</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Time</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Guests</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Phone</th>
                                            <th className="py-3 px-4 text-charcoal-400 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map((res) => (
                                            <tr key={res._id} className="border-b border-charcoal-800/50 hover:bg-charcoal-800/30 transition-colors">
                                                <td className="py-3 px-4 text-cream-50">{res.name}</td>
                                                <td className="py-3 px-4 text-charcoal-300">{res.date}</td>
                                                <td className="py-3 px-4 text-charcoal-300">{res.time}</td>
                                                <td className="py-3 px-4 text-charcoal-300">{res.guests}</td>
                                                <td className="py-3 px-4 text-charcoal-300">{res.phone}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`badge ${res.status === 'Confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Menu Item Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-display font-semibold text-cream-50">
                                        {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="text-charcoal-400 hover:text-cream-50 transition-colors">
                                        <HiOutlineX className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleMenuSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-charcoal-300 mb-1">Name</label>
                                        <input
                                            required
                                            className="input-field"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            id="menu-form-name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-charcoal-300 mb-1">Description</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="input-field resize-none"
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            id="menu-form-description"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-charcoal-300 mb-1">Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                required
                                                className="input-field"
                                                value={form.price}
                                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                                id="menu-form-price"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-charcoal-300 mb-1">Category</label>
                                            <select
                                                className="select-field"
                                                value={form.category}
                                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                id="menu-form-category"
                                            >
                                                {categories.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-charcoal-300 mb-1">Image URL</label>
                                        <input
                                            className="input-field"
                                            value={form.image}
                                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                                            placeholder="https://..."
                                            id="menu-form-image"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.available}
                                            onChange={(e) => setForm({ ...form, available: e.target.checked })}
                                            className="w-4 h-4 rounded border-charcoal-600 text-gold-500 focus:ring-gold-500"
                                            id="menu-form-available"
                                        />
                                        <label className="text-sm text-charcoal-300">Available</label>
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full btn-primary py-3"
                                        id="menu-form-submit"
                                    >
                                        {editingItem ? 'Update Item' : 'Create Item'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
