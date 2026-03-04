import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders', {
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

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-500',
            'Processing': 'bg-blue-500',
            'Shipped': 'bg-purple-500',
            'Delivered': 'bg-green-500',
            'Cancelled': 'bg-red-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                            <span className="text-xl font-bold tracking-tight dark:text-white text-slate-900">HPX Cam</span>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative p-2 text-gray-500 dark:text-[#9eb7a8] hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined">shopping_cart</span>
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="p-2 text-primary dark:text-primary transition-colors"
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
                        <h1 className="text-4xl font-bold dark:text-white text-slate-900">My Orders</h1>
                    </div>
                    <p className="text-text-secondary ml-14">
                        {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-[#29382f]">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-[#9eb7a8] mb-1">
                                                Order ID: <span className="font-mono font-semibold text-white">{order._id.slice(-8).toUpperCase()}</span>
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-[#9eb7a8]">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 dark:text-[#9eb7a8]">Total</p>
                                                <p className="text-2xl font-bold text-primary">
                                                    ${order.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h3 className="font-bold mb-4">Order Items ({order.items.length})</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-[#29382f] last:border-0">
                                                <div className="w-20 h-20 bg-gray-100 dark:bg-[#15231b] rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-xs text-gray-500 dark:text-[#9eb7a8] font-semibold uppercase mb-1">
                                                        {item.brand}
                                                    </p>
                                                    <h4 className="font-bold mb-1">{item.name}</h4>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-500 dark:text-[#9eb7a8]">
                                                            Quantity: {item.quantity}
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-6xl text-gray-300 dark:text-[#29382f] mb-4">
                            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>package_2</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                        <p className="text-text-secondary mb-6">Start shopping to see your orders here!</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-6 py-3 bg-primary text-background-dark rounded-full font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Start Shopping
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

export default Orders;
