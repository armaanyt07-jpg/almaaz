import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineBookOpen, HiOutlineCalendar, HiOutlineStar, HiOutlineSparkles } from 'react-icons/hi';

const Home = () => {
    const features = [
        {
            icon: HiOutlineBookOpen,
            title: 'Curated Menu',
            description: 'Authentic Middle Eastern dishes crafted by our award-winning chefs.',
        },
        {
            icon: HiOutlineCalendar,
            title: 'Easy Reservations',
            description: 'Book your table online with instant confirmation.',
        },
        {
            icon: HiOutlineStar,
            title: 'Premium Dining',
            description: 'An unforgettable experience in an elegant ambiance.',
        },
        {
            icon: HiOutlineSparkles,
            title: 'Fresh Ingredients',
            description: 'Locally sourced, premium quality ingredients in every dish.',
        },
    ];

    const featuredDishes = [
        {
            name: 'Al-Maaz Royal Feast',
            price: '$45.99',
            image: 'https://placehold.co/400x300/1a1a2e/e0a96d?text=Royal+Feast',
        },
        {
            name: 'Grilled Lamb Chops',
            price: '$24.99',
            image: 'https://placehold.co/400x300/1a1a2e/e0a96d?text=Lamb+Chops',
        },
        {
            name: 'Kunafa',
            price: '$9.99',
            image: 'https://placehold.co/400x300/1a1a2e/e0a96d?text=Kunafa',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <span className="inline-block text-gold-500 text-sm font-medium tracking-widest uppercase mb-4">
                            ✦ Premium Middle Eastern Dining ✦
                        </span>
                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold text-cream-50 mb-6 leading-tight">
                            Al-<span className="text-gold-500">Maaz</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-charcoal-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                            Where tradition meets culinary excellence. Experience the finest
                            Middle Eastern flavors in an atmosphere of timeless elegance.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/menu" className="btn-primary text-lg px-8 py-4" id="explore-menu-btn">
                            Explore Menu
                        </Link>
                        <Link to="/reservations" className="btn-secondary text-lg px-8 py-4" id="reserve-table-btn">
                            Reserve a Table
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-charcoal-500 rounded-full flex items-start justify-center p-1">
                        <div className="w-1.5 h-3 bg-gold-500 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-charcoal-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="section-heading">Why Choose Al-Maaz</h2>
                        <p className="section-subheading mx-auto mt-3">
                            Every detail is crafted to make your dining experience extraordinary.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card p-6 text-center group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/20 transition-colors">
                                    <feature.icon className="w-7 h-7 text-gold-500" />
                                </div>
                                <h3 className="text-cream-50 font-semibold mb-2">{feature.title}</h3>
                                <p className="text-charcoal-300 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Dishes */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="section-heading">Signature Dishes</h2>
                        <p className="section-subheading mx-auto mt-3">
                            Hand-picked favorites from our chefs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredDishes.map((dish, i) => (
                            <motion.div
                                key={dish.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                whileHover={{ y: -8 }}
                                className="card group"
                            >
                                <div className="relative overflow-hidden h-56">
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-cream-50 font-display text-xl font-semibold">{dish.name}</h3>
                                        <p className="text-gold-400 font-bold">{dish.price}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/menu" className="btn-secondary px-8">
                            View Full Menu →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-charcoal-900 via-charcoal-800/50 to-charcoal-900">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-cream-50 mb-4">
                            Ready for an Unforgettable Evening?
                        </h2>
                        <p className="text-charcoal-300 text-lg mb-8">
                            Reserve your table now and let us create a memorable dining experience for you.
                        </p>
                        <Link to="/reservations" className="btn-primary text-lg px-10 py-4">
                            Book Your Table
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
