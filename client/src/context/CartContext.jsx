import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        const itemId = item._id || item.id;
        setCart(prev => {
            const existing = prev.find(i => i.id === itemId);
            if (existing) {
                return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, id: itemId, quantity: 1 }];
        });
    };

    const addMultipleToCart = (items) => {
        setCart(prev => {
            const newCart = [...prev];
            items.forEach(item => {
                const itemId = item._id || item.id;
                const newItem = { ...item, id: itemId };
                const existingIndex = newCart.findIndex(i => i.id === itemId);
                if (existingIndex > -1) {
                    newCart[existingIndex].quantity += newItem.quantity;
                } else {
                    newCart.push(newItem);
                }
            });
            return newCart;
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                const newQty = Math.max(0, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }).filter(i => i.quantity > 0));
    };

    const clearCart = () => setCart([]);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, addMultipleToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
