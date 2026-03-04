import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
                if (response.data.data.items.length === 0) {
                    toast.error('Your cart is empty', {
                        style: {
                            background: '#122017',
                            color: '#ff6b6b',
                            border: '1px solid #1a2c22'
                        }
                    });
                    navigate('/cart');
                    return;
                }
                setCart(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitOrder = async () => {
        try {
            setSubmitting(true);
            const response = await api.post('/orders', {});

            if (response.data.success) {
                toast.success('Order placed successfully!', {
                    style: {
                        background: '#122017',
                        color: '#38e07b',
                        border: '1px solid #1a2c22'
                    },
                    duration: 3000
                });
                setTimeout(() => {
                    navigate('/orders');
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to place order', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body antialiased min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-[#29382f]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
                            <div className="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">HPX Cam</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate('/cart')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-[#29382f] rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-4xl font-bold">Checkout</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {cart && cart.items.map((item) => (
                                    <div key={item._id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-[#29382f] last:border-0">
                                        <div className="w-20 h-20 bg-gray-100 dark:bg-[#15231b] rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-xs text-gray-500 dark:text-[#9eb7a8] font-semibold uppercase mb-1">
                                                {item.product.brand}
                                            </p>
                                            <h3 className="font-bold">{item.product.name}</h3>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm text-gray-500 dark:text-[#9eb7a8]">
                                                    Qty: {item.quantity}
                                                </span>
                                                <span className="font-bold text-primary">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
                            <p className="text-sm text-gray-500 dark:text-[#9eb7a8] mb-2">
                                Delivery to: <span className="font-semibold text-white">{user?.name}</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-[#9eb7a8]">
                                Payment: <span className="font-semibold text-white">Cash on Delivery</span>
                            </p>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-[#9eb7a8]">Subtotal</span>
                                    <span className="font-semibold">${cart?.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-[#9eb7a8]">Shipping</span>
                                    <span className="font-semibold text-primary">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-[#9eb7a8]">Tax</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-[#29382f] pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-2xl font-bold text-primary">
                                            ${cart?.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmitOrder}
                                disabled={submitting}
                                className="w-full py-4 bg-primary text-background-dark rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-background-dark border-t-transparent"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Place Order</span>
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-center text-gray-500 dark:text-[#9eb7a8] mt-4">
                                By placing this order, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-[#29382f] py-8 bg-surface-light dark:bg-background-dark mt-auto">
                <div className="max-w-[1440px] mx-auto px-6 text-center text-sm text-gray-500 dark:text-[#9eb7a8]">
                    <p>© HP Filmcity. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Checkout;
