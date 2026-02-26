import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';

const Footer = () => {
    return (
        <footer className="bg-charcoal-900 border-t border-charcoal-700/30 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-display font-bold text-gold-500 mb-3">Al-Maaz</h3>
                        <p className="text-charcoal-300 text-sm leading-relaxed">
                            A premium Middle Eastern dining experience. Crafted with passion,
                            served with elegance.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-cream-100 font-semibold mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'Menu', path: '/menu' },
                                { name: 'Reservations', path: '/reservations' },
                                { name: 'My Orders', path: '/orders' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-charcoal-300 hover:text-gold-400 text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-cream-100 font-semibold mb-3">Contact</h4>
                        <ul className="space-y-2 text-sm text-charcoal-300">
                            <li className="flex items-center gap-2">
                                <HiOutlineLocationMarker className="text-gold-500 w-4 h-4 flex-shrink-0" />
                                123 Culinary Avenue, Food City
                            </li>
                            <li className="flex items-center gap-2">
                                <HiOutlinePhone className="text-gold-500 w-4 h-4 flex-shrink-0" />
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-center gap-2">
                                <HiOutlineMail className="text-gold-500 w-4 h-4 flex-shrink-0" />
                                hello@almaaz.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-charcoal-700/30 mt-8 pt-6 text-center">
                    <p className="text-charcoal-400 text-sm">
                        &copy; {new Date().getFullYear()} Al-Maaz Restaurant. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
