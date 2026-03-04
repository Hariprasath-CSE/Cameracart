import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products?category=${category}`);
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products', {
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

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || token === 'null' || token === 'undefined') {
                toast.error('Please login to add items to cart', {
                    style: {
                        background: '#122017',
                        color: '#ff6b6b',
                        border: '1px solid #1a2c22'
                    }
                });
                navigate('/login');
                return;
            }
            const response = await api.post('/cart/add', { productId, quantity: 1 });

            if (response.data.success) {
                toast.success('Added to cart!', {
                    style: {
                        background: '#122017',
                        color: '#38e07b',
                        border: '1px solid #1a2c22'
                    },
                    duration: 1500
                });
                // Navigate to cart page after a short delay
                setTimeout(() => {
                    navigate('/cart');
                }, 1000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
        }
    };

    const getCategoryTitle = () => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const getCategoryDescription = () => {
        const descriptions = {
            mirrorless: 'Discover our cutting-edge mirrorless cameras with advanced autofocus, stunning image quality, and compact designs.',
            dslr: 'Explore professional DSLR cameras with exceptional performance, robust build quality, and extensive lens options.',
            accessories: 'Browse essential camera accessories including lenses, tripods, bags, filters, and more to enhance your photography.'
        };
        return descriptions[category.toLowerCase()] || 'Browse our collection';
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body antialiased selection:bg-primary selection:text-background-dark min-h-screen flex flex-col">
            {/* Sticky Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-[#29382f]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/home')}>
                            <div className="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight dark:text-white text-slate-900">HPX Cam</span>
                        </div>

                        {/* Search Bar (Center) */}
                        <div className="hidden md:flex flex-1 max-w-2xl">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 dark:text-[#9eb7a8]">search</span>
                                </div>
                                <input
                                    className="block w-full pl-12 pr-4 py-3 rounded-full border-none bg-gray-100 dark:bg-[#29382f] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9eb7a8] focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                    placeholder="Search cameras, lenses, accessories..." type="text" />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative p-2 text-gray-500 dark:text-[#9eb7a8] hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined">shopping_cart</span>
                                <span className="absolute top-1 right-0 size-2.5 bg-primary rounded-full ring-2 ring-white dark:ring-background-dark"></span>
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="p-2 text-gray-500 dark:text-[#9eb7a8] hover:text-primary dark:hover:text-primary transition-colors hidden sm:block"
                            >
                                <span className="material-symbols-outlined">package_2</span>
                            </button>
                            <div className="h-8 w-px bg-gray-200 dark:bg-[#29382f] hidden sm:block"></div>

                            {/* User Profile Area with Dropdown */}
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

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowDropdown(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-3 w-48 py-2 bg-surface-light dark:bg-[#1a2c22] border border-gray-200 dark:border-[#29382f] rounded-xl shadow-2xl z-50 animate-fade-in">
                                            <div className="px-4 py-2 border-b border-gray-100 dark:border-[#29382f] mb-1 lg:hidden">
                                                <p className="text-sm font-bold dark:text-white">{user?.name}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <p className="text-xs text-[#9eb7a8] capitalize">{user?.role || 'user'}</p>
                                                    <span className="text-xs text-gray-500 dark:text-[#9eb7a8] bg-gray-100 dark:bg-[#1a2c22] px-2 py-0.5 rounded-full">Pro Member</span>
                                                </div>
                                            </div>
                                            <button className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#29382f] flex items-center gap-3 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">person</span>
                                                Profile
                                            </button>
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
                {/* Category Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-[#29382f] rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold dark:text-white text-slate-900">{getCategoryTitle()}</h1>
                            <p className="text-text-secondary mt-2">{getCategoryDescription()}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-text-secondary">
                            {loading ? 'Loading...' : `${products.length} products found`}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {/* Product Grid */}
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-[#15231b]">
                                            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white uppercase tracking-wider">
                                                {product.brand}
                                            </div>
                                            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary hover:text-background-dark transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                                                </button>
                                            </div>
                                            <div
                                                className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${product.image})` }}
                                            ></div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold dark:text-white text-slate-900 leading-tight">{product.name}</h3>
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    <span className="material-symbols-outlined text-[16px] fill">star</span>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-text-secondary mb-4 line-clamp-2">{product.description}</p>
                                            <div className="mt-auto flex items-end justify-between">
                                                <div>
                                                    {product.originalPrice && (
                                                        <p className="text-xs text-text-secondary line-through">${product.originalPrice.toFixed(2)}</p>
                                                    )}
                                                    <p className="text-xl font-bold text-primary">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product._id)}
                                                    className="p-3 bg-primary text-background-dark rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                                                >
                                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="text-6xl text-gray-300 dark:text-[#29382f] mb-4">
                                    <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>inventory_2</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">No products found</h3>
                                <p className="text-text-secondary mb-6">Check back later for new arrivals!</p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="px-6 py-3 bg-primary text-background-dark rounded-full font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    Back to Home
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-[#29382f] py-8 bg-surface-light dark:bg-background-dark mt-auto">
                <div className="max-w-[1440px] mx-auto px-6 text-center text-sm text-gray-500 dark:text-[#9eb7a8]">
                    <p>© HP Filmcity. All rights reserved. Designed for Future pixcrackers.</p>
                </div>
            </footer>
        </div>
    );
};

export default CategoryPage;
