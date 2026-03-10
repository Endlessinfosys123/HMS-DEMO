import { create } from 'zustand';

export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface GlobalState {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;

    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

export const useStore = create<GlobalState>((set) => ({
    notifications: [],
    addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now().toString() + Math.random().toString() }]
    })),
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),

    cart: [],
    addToCart: (item) => set((state) => {
        const existing = state.cart.find(c => c.id === item.id);
        if (existing) {
            return { cart: state.cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
    removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(c => c.id !== id)
    })),
    clearCart: () => set({ cart: [] }),
}));
