import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const Home = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [favourites, setFavourites] = useState(() => {
        try {
            const stored = localStorage.getItem('favourites');
            return new Set(stored ? JSON.parse(stored) : []);
        } catch { return new Set(); }
    });
    const [showFavourites, setShowFavourites] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
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

    const toggleFavourite = (product) => {
        setFavourites((prev) => {
            const updated = new Set(prev);
            if (updated.has(product._id)) {
                updated.delete(product._id);
                toast('Removed from favourites', {
                    icon: '🤍',
                    style: { background: '#122017', color: '#9eb7a8', border: '1px solid #1a2c22' }
                });
            } else {
                updated.add(product._id);
                toast.success(`❤️ Added to favourites!`, {
                    style: { background: '#122017', color: '#38e07b', border: '1px solid #1a2c22' },
                    duration: 1500
                });
            }
            localStorage.setItem('favourites', JSON.stringify([...updated]));
            return updated;
        });
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

            console.log('📦 Adding product to cart:', productId);
            const response = await api.post('/cart/add', { productId, quantity: 1 });

            console.log('✅ Cart response:', response.data);

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
            console.error('❌ Error adding to cart:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response data (JSON):', JSON.stringify(error.response?.data, null, 2));
            console.error('Status code:', error.response?.status);
            console.error('Full error:', error);

            const errorMsg = error.response?.data?.message || 'Failed to add to cart';
            toast.error(errorMsg, {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                },
                duration: 3000
            });
        }
    };


    const categories = ['All', 'Mirrorless', 'DSLR', 'Accessories'];

    const handleCategoryClick = (cat) => {
        if (cat === 'All') {
            setActiveFilter('All');
        } else {
            navigate(`/category/${cat}`);
        }
    };

    // Filter products based on search query
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body antialiased selection:bg-primary selection:text-background-dark min-h-screen flex flex-col">
            {/* Sticky Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-[#29382f]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
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
                                    placeholder="Search cameras, lenses, accessories..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        {/* Right Actions */}
                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            {/* Favourites Button */}
                            <button
                                onClick={() => setShowFavourites((v) => !v)}
                                className="relative p-2 text-gray-500 dark:text-[#9eb7a8] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                title="My Favourites"
                            >
                                <span className={`material-symbols-outlined ${favourites.size > 0 ? 'text-red-500' : ''}`}>favorite</span>
                                {favourites.size > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                        {favourites.size}
                                    </span>
                                )}
                            </button>
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
                                            {user ? user.name : 'AdminHP'}
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
                {/* Mobile Search (visible only on small screens) */}
                <div className="md:hidden pb-4 px-4">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 dark:text-[#9eb7a8]">search</span>
                        </div>
                        <input
                            className="block w-full pl-12 pr-4 py-3 rounded-full border-none bg-gray-100 dark:bg-[#29382f] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9eb7a8] focus:ring-2 focus:ring-primary shadow-inner"
                            placeholder="Search..."
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </nav>

            {/* Favourites Panel */}
            {showFavourites && (
                <div className="w-full bg-surface-light dark:bg-[#1a2c22] border-b border-gray-200 dark:border-[#29382f] shadow-2xl animate-fade-in z-40">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">favorite</span>
                                My Favourites
                                <span className="text-sm font-normal text-text-secondary">({favourites.size} items)</span>
                            </h2>
                            <button
                                onClick={() => setShowFavourites(false)}
                                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#29382f] transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        {favourites.size === 0 ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-[#29382f] block mb-2">favorite_border</span>
                                <p className="text-text-secondary">No favourites yet. Click the ❤️ on any product!</p>
                            </div>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                                {products.filter((p) => favourites.has(p._id)).map((product) => (
                                    <div key={product._id} className="flex-shrink-0 w-52 bg-gray-100 dark:bg-[#15231b] rounded-xl overflow-hidden group">
                                        <div
                                            className="w-full h-32 bg-center bg-contain bg-no-repeat cursor-pointer"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                            onClick={() => { setShowFavourites(false); navigate(`/product/${product._id}`); }}
                                        />
                                        <div className="p-3">
                                            <p className="text-sm font-bold dark:text-white text-slate-900 truncate mb-1">{product.name}</p>
                                            <p className="text-primary font-bold text-sm mb-3">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { addToCart(product._id); }}
                                                    className="flex-1 py-1.5 bg-primary text-background-dark rounded-full text-xs font-bold hover:bg-primary-dark transition-colors"
                                                >
                                                    Add to Cart
                                                </button>
                                                <button
                                                    onClick={() => toggleFavourite(product)}
                                                    className="p-1.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition-colors"
                                                    title="Remove from favourites"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold dark:text-white text-slate-900 hidden sm:block">Explore Gear</h1>
                    <div className="w-full sm:w-auto overflow-x-auto hide-scrollbar">
                        <div className="flex gap-3 pb-2 sm:pb-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-full transition-all duration-300 ${activeFilter === cat
                                        ? 'bg-primary text-background-dark font-bold shadow-lg shadow-primary/20 scale-105 transition-transform'
                                        : 'bg-gray-200 dark:bg-[#29382f] text-gray-700 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-[#384b3f]'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-[#15231b]">
                                    <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white uppercase tracking-wider">
                                        {product.brand}
                                    </div>
                                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFavourite(product); }}
                                            className={`p-2 backdrop-blur-md rounded-full transition-all duration-200 hover:scale-110 ${favourites.has(product._id)
                                                ? 'bg-red-500/20 text-red-500'
                                                : 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400'
                                                }`}
                                            title={favourites.has(product._id) ? 'Remove from favourites' : 'Add to favourites'}
                                        >
                                            <span className={`material-symbols-outlined text-[20px] ${favourites.has(product._id) ? 'fill' : ''
                                                }`}>favorite</span>
                                        </button>
                                    </div>
                                    <div
                                        className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${product.image})` }}
                                    ></div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold dark:text-white text-slate-900 leading-tight mb-2">{product.name}</h3>
                                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{product.description}</p>
                                    <div className="mt-auto">
                                        <div className="flex items-baseline justify-between mb-4">
                                            <div>
                                                {product.originalPrice && (
                                                    <p className="text-xs text-text-secondary line-through">${product.originalPrice.toFixed(2)}</p>
                                                )}
                                                <p className="text-xl font-bold text-primary">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-[#29382f] text-gray-700 dark:text-white rounded-full font-medium hover:bg-gray-300 dark:hover:bg-[#384b3f] transition-colors text-sm"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => addToCart(product._id)}
                                                className="p-2.5 bg-primary text-background-dark rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-[#29382f] mb-4">search_off</span>
                        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">No products found</h3>
                        <p className="text-text-secondary text-center max-w-md">
                            We couldn't find any products matching "{searchQuery}". Try adjusting your search terms.
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-6 px-6 py-3 bg-primary text-background-dark rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Load More Section */}
                <div className="flex justify-center mt-12 mb-8">
                    <button className="px-8 py-3 rounded-full border border-gray-300 dark:border-[#29382f] text-gray-700 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-[#29382f] hover:border-transparent transition-all flex items-center gap-2">
                        <span>Load More Products</span>
                        <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                </div>
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

export default Home;
