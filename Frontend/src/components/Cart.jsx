import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');
            if (response.data.success) {
                setCart(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const response = await api.put('/cart/update', { productId, quantity: newQuantity });
            if (response.data.success) {
                setCart(response.data.data);
                toast.success('Cart updated', {
                    style: {
                        background: '#122017',
                        color: '#38e07b',
                        border: '1px solid #1a2c22'
                    }
                });
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Failed to update cart', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await api.delete(`/cart/remove/${productId}`);
            if (response.data.success) {
                setCart(response.data.data);
                toast.success('Item removed from cart', {
                    style: {
                        background: '#122017',
                        color: '#38e07b',
                        border: '1px solid #1a2c22'
                    }
                });
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        toast.success('Logged out successfully', {
            style: {
                background: '#122017',
                color: '#38e07b',
                border: '1px solid #1a2c22'
            }
        });
        navigate('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body antialiased selection:bg-primary selection:text-background-dark min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-[#29382f]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 gap-8">
                        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/home')}>
                            <div className="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight dark:text-white text-slate-900">CameraCart</span>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative p-2 text-primary dark:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined">shopping_cart</span>
                                {cart && cart.items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-background-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.items.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="p-2 text-gray-500 dark:text-[#9eb7a8] hover:text-primary dark:hover:text-primary transition-colors hidden sm:block"
                            >
                                <span className="material-symbols-outlined">package_2</span>
                            </button>
                            <div className="h-8 w-px bg-gray-200 dark:bg-[#29382f] hidden sm:block"></div>

                            <div className="relative">
                                <div
                                    className="flex items-center gap-3 pl-2 cursor-pointer group"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <div className="flex flex-col items-end hidden lg:block">
                                        <span className="text-sm font-semibold dark:text-white leading-tight group-hover:text-primary transition-colors">
                                            {user ? user.name : 'User'}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-[#9eb7a8] font-medium bg-gray-100 dark:bg-[#29382f] px-2.5 py-0.5 rounded-full mt-1 inline-block">Pro Member</span>
                                    </div>
                                    <div className="size-10 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary cursor-pointer transition-all shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20">
                                        <img
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqM51sA31hx9K_rF04lexDWgzLrlfWXWbkLB_ZOtVcslWJX1FNW6HWm0MFR8NTK_xwHtO_PqTnUpd3PEHctqsgMefbUTDl5VZ3kVzJ7m7WlD8cNod1f9ZOCIunYnCn5Zldef9i6STg8qsOqvL9CvcYents7WWWseMm004JnNfF6T94jcCZqoHDWRJnFiiHrVFR-Zc0-iAKvMYFhjiU_MIyfE5Zy2KoKtccx-odT4iXnBbl_TIia3p_4D1fHyqv0dlFsNdNuG7sq2xc"
                                            alt="User Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className={`material-symbols-outlined text-sm text-[#9eb7a8] transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </div>

                                {showDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                                        <div className="absolute right-0 mt-3 w-48 py-2 bg-surface-light dark:bg-[#1a2c22] border border-gray-200 dark:border-[#29382f] rounded-xl shadow-2xl z-50">
                                            <button className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#29382f] flex items-center gap-3 transition-colors text-red-500 hover:text-red-600"
                                                onClick={handleLogout}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-[#29382f] rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-4xl font-bold dark:text-white text-slate-900">Shopping Cart</h1>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : cart && cart.items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 flex gap-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-[#15231b] rounded-lg overflow-hidden">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-[#9eb7a8] font-semibold uppercase tracking-wider mb-1">
                                                    {item.product.brand}
                                                </p>
                                                <h3 className="text-lg font-bold dark:text-white">{item.product.name}</h3>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                        <p className="text-xl font-bold text-primary mb-4">
                                            ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500 dark:text-[#9eb7a8]">Quantity:</span>
                                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#29382f] rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-[#384b3f] rounded transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">remove</span>
                                                </button>
                                                <span className="font-bold min-w-[2rem] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-[#384b3f] rounded transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-[#9eb7a8]">Items ({cart.items.length})</span>
                                        <span className="font-semibold">${cart.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-[#9eb7a8]">Shipping</span>
                                        <span className="font-semibold text-primary">FREE</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-[#29382f] pt-3 mt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-2xl font-bold text-primary">
                                                ${cart.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-primary text-background-dark rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                                >
                                    <span>Proceed to Checkout</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-6xl text-gray-300 dark:text-[#29382f] mb-4">
                            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>shopping_cart</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                        <p className="text-text-secondary mb-6">Add some products to get started!</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-6 py-3 bg-primary text-background-dark rounded-full font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-[#29382f] py-8 bg-surface-light dark:bg-background-dark mt-auto">
                <div className="max-w-[1440px] mx-auto px-6 text-center text-sm text-gray-500 dark:text-[#9eb7a8]">
                    <p>© HP Filmcity. All rights reserved. Designed for Future pixcrackers.</p>
                </div>
            </footer>
        </div>
    );
};

export default Cart;
