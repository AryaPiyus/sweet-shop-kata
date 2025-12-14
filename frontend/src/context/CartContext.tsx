import { createContext, useContext, useState, type ReactNode } from 'react';

// Define what a Cart Item looks like
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number; // How many the user wants to buy
  maxStock: number; // To prevent adding more than available
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // 1. Add Item (Group if already exists)
  const addToCart = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existing = currentItems.find((i) => i.id === newItem.id);
      
      if (existing) {
        // If adding exceeds stock, ignore
        if (existing.quantity + 1 > existing.maxStock) return currentItems;
        
        return currentItems.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  // 2. Remove Item completely
  const removeFromCart = (id: number) => {
    setItems((current) => current.filter((i) => i.id !== id));
  };

  // 3. Increment/Decrement (+1 or -1)
  const updateQuantity = (id: number, delta: number) => {
    setItems((current) => 
      current.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          // Constraints: Min 1, Max = Stock
          if (newQty < 1) return item; 
          if (newQty > item.maxStock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  // Derived State
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};