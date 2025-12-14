import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }

    setCheckoutLoading(true);
    try {
      // THE SPAR: We need to loop because our backend currently 
      // only supports buying one item type at a time.
      // Ideally, we would build a Bulk API endpoint.
      for (const item of items) {
        await api.post(`/sweets/${item.id}/purchase`, { amount: item.quantity });
      }
      
      alert('Order placed successfully!');
      clearCart();
      onClose();
      // Force refresh of dashboard to update stocks
      window.location.reload(); 
    } catch (error) {
      alert('Checkout failed. Some items might be out of stock.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                ✕
              </button>
            </div>

            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <p className="text-4xl mb-4">🛒</p>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white border p-3 rounded-lg shadow-sm">
                    <div className="h-16 w-16 bg-blue-50 rounded-md flex items-center justify-center text-2xl">
                      🍭
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-blue-600 font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600">-</button>
                        <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 underline">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
                >
                  {checkoutLoading ? 'Processing Order...' : 'Checkout Now'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}