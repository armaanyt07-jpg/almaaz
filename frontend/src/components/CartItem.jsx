import { HiOutlineMinus, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQty, removeFromCart } = useCart();

    return (
        <div className="flex items-center gap-4 p-4 card rounded-xl">
            {/* Image */}
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h4 className="text-cream-50 font-semibold truncate">{item.name}</h4>
                <p className="text-gold-400 font-medium">${item.price.toFixed(2)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-charcoal-700 hover:bg-charcoal-600 flex items-center justify-center text-cream-100 transition-colors"
                >
                    <HiOutlineMinus className="w-4 h-4" />
                </button>
                <span className="text-cream-50 font-semibold w-8 text-center">{item.quantity}</span>
                <button
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-charcoal-700 hover:bg-charcoal-600 flex items-center justify-center text-cream-100 transition-colors"
                >
                    <HiOutlinePlus className="w-4 h-4" />
                </button>
            </div>

            {/* Subtotal & Remove */}
            <div className="text-right flex-shrink-0">
                <p className="text-cream-50 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-300 mt-1 transition-colors"
                >
                    <HiOutlineTrash className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
