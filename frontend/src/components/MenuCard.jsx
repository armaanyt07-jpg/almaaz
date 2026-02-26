import { motion } from 'framer-motion';
import { HiOutlinePlus } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const MenuCard = ({ item, index }) => {
    const { addToCart } = useCart();

    const handleAdd = () => {
        addToCart(item);
        toast.success(`${item.name} added to cart!`, {
            style: {
                background: '#1a1a2e',
                color: '#fefcf7',
                border: '1px solid rgba(224, 169, 109, 0.3)',
            },
            iconTheme: { primary: '#e0a96d', secondary: '#1a1a2e' },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            className="card group cursor-pointer"
        >
            {/* Image */}
            <div className="relative overflow-hidden h-48">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
                <span className="absolute top-3 right-3 badge bg-gold-500/90 text-charcoal-900 text-xs font-semibold">
                    {item.category}
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-display font-semibold text-cream-50 group-hover:text-gold-400 transition-colors">
                        {item.name}
                    </h3>
                    <span className="text-gold-400 font-bold text-lg ml-2 flex-shrink-0">
                        ${item.price.toFixed(2)}
                    </span>
                </div>
                <p className="text-charcoal-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                </p>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
                    id={`add-to-cart-${item._id}`}
                >
                    <HiOutlinePlus className="w-4 h-4" />
                    Add to Cart
                </motion.button>
            </div>
        </motion.div>
    );
};

export default MenuCard;
