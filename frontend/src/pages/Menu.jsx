import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import MenuCard from '../components/MenuCard';

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages', 'Specials'];

const Menu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const params = activeCategory !== 'All' ? { category: activeCategory } : {};
                const { data } = await API.get('/menu', { params });
                setItems(data);
            } catch (error) {
                console.error('Failed to fetch menu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [activeCategory]);

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="section-heading">Our Menu</h1>
                    <p className="section-subheading mx-auto mt-3">
                        Discover our carefully curated selection of authentic Middle Eastern delicacies.
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-10"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-gold-500 text-charcoal-900 shadow-lg shadow-gold-500/25'
                                    : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700 hover:text-cream-50'
                                }`}
                            id={`category-${cat.toLowerCase()}`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-48 bg-charcoal-700/50" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-charcoal-700/50 rounded w-3/4" />
                                    <div className="h-4 bg-charcoal-700/50 rounded w-full" />
                                    <div className="h-10 bg-charcoal-700/50 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-charcoal-400 text-lg">No items found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item, index) => (
                            <MenuCard key={item._id} item={item} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
