import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineMenu, HiOutlineX, HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        { name: 'Reservations', path: '/reservations' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl md:text-3xl font-display font-bold text-gold-500 group-hover:text-gold-400 transition-colors">
                            Al-Maaz
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-cream-100 hover:text-gold-400 font-medium transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                        {user && user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative text-cream-100 hover:text-gold-400 transition-colors p-2"
                        >
                            <HiOutlineShoppingBag className="w-6 h-6" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-gold-500 text-charcoal-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* Auth */}
                        {user ? (
                            <div className="hidden md:flex items-center space-x-3">
                                <Link to="/orders" className="text-cream-200 hover:text-gold-400 transition-colors">
                                    <HiOutlineUser className="w-5 h-5 inline mr-1" />
                                    <span className="text-sm">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-charcoal-300 hover:text-red-400 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-cream-100 hover:text-gold-400 transition-colors p-2"
                            id="mobile-menu-btn"
                        >
                            {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-charcoal-700/30 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 px-3 text-cream-100 hover:text-gold-400 hover:bg-charcoal-800/50 rounded-lg transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user && user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 px-3 text-gold-400 hover:bg-charcoal-800/50 rounded-lg transition-all"
                                >
                                    Dashboard
                                </Link>
                            )}
                            {user ? (
                                <>
                                    <Link
                                        to="/orders"
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2 px-3 text-cream-100 hover:text-gold-400 hover:bg-charcoal-800/50 rounded-lg transition-all"
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left py-2 px-3 text-red-400 hover:bg-charcoal-800/50 rounded-lg transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 px-3 text-gold-400 hover:bg-charcoal-800/50 rounded-lg transition-all"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
