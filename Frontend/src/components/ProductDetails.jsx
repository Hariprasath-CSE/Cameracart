import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [userRating, setUserRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            if (response.data.success) {
                setProduct(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            toast.error('Failed to load product details', {
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

    const addToCart = async () => {
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

            const response = await api.post('/cart/add', { productId: id, quantity });

            if (response.data.success) {
                toast.success('Added to cart!', {
                    style: {
                        background: '#122017',
                        color: '#38e07b',
                        border: '1px solid #1a2c22'
                    },
                    duration: 1500
                });
                setTimeout(() => {
                    navigate('/cart');
                }, 1000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error(error.response?.data?.message || 'Failed to add to cart', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
        }
    };

    const handleSubmitReview = async () => {
        if (!userRating) {
            toast.error('Please select a rating', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
            return;
        }

        if (!reviewText.trim()) {
            toast.error('Please write a review', {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
            return;
        }

        setSubmittingReview(true);
        try {
            const response = await api.post(`/products/${id}/review`, {
                rating: userRating,
                comment: reviewText.trim()
            });

            if (response.data.success) {
                toast.success('Thank you for your review!', {
                    style: {
                        background: '#122017',
                        color: '#38e07b',
                        border: '1px solid #1a2c22'
                    }
                });

                // Update product state with fresh reviews + recalculated rating
                setProduct((prev) => ({
                    ...prev,
                    reviews: response.data.data.reviews,
                    rating: response.data.data.rating,
                    reviewCount: response.data.data.reviewCount
                }));

                // Reset form
                setUserRating(0);
                setReviewText('');
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Failed to submit review';
            toast.error(errMsg, {
                style: {
                    background: '#122017',
                    color: '#ff6b6b',
                    border: '1px solid #1a2c22'
                }
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-[#29382f] mb-4">error</span>
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Product not found</h3>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-3 bg-primary text-background-dark rounded-full font-bold hover:bg-primary-dark transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-[#29382f]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-[#29382f] rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                                <div className="size-8 text-primary">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight">HPX Cam</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/cart')}
                            className="p-2 text-gray-500 dark:text-[#9eb7a8] hover:text-primary dark:hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Product Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Product Image */}
                    <div className="relative">
                        <div className="sticky top-24">
                            <div className="aspect-square bg-gray-100 dark:bg-[#15231b] rounded-2xl overflow-hidden">
                                <div
                                    className="w-full h-full bg-center bg-contain bg-no-repeat"
                                    style={{ backgroundImage: `url(${product.image})` }}
                                ></div>
                            </div>
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold text-white uppercase">
                                {product.brand}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">{product.category}</p>
                            <h1 className="text-4xl font-bold dark:text-white text-slate-900 mb-4">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`material-symbols-outlined text-[20px] ${i < Math.floor(product.rating)
                                                    ? 'text-amber-400 fill'
                                                    : 'text-gray-300 dark:text-[#29382f]'
                                                    }`}
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-lg font-bold dark:text-white">{product.rating}</span>
                                    <span className="text-sm text-text-secondary">({product.reviewCount || 0} reviews)</span>
                                </div>
                            </div>

                            <p className="text-text-secondary text-lg leading-relaxed mb-6">{product.description}</p>

                            {/* Price */}
                            <div className="mb-8">
                                {product.originalPrice && (
                                    <p className="text-lg text-text-secondary line-through mb-1">${product.originalPrice.toFixed(2)}</p>
                                )}
                                <div className="flex items-baseline gap-3">
                                    <p className="text-5xl font-bold text-primary">${product.price.toFixed(2)}</p>
                                    {product.originalPrice && (
                                        <span className="text-sm font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                                            Save ${(product.originalPrice - product.price).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-2 text-green-500">
                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                        <span className="font-medium">In Stock ({product.stock} available)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-500">
                                        <span className="material-symbols-outlined text-[20px]">cancel</span>
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium mb-2">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 bg-gray-200 dark:bg-[#29382f] rounded-lg hover:bg-gray-300 dark:hover:bg-[#384b3f] transition-colors"
                                    >
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="p-3 bg-gray-200 dark:bg-[#29382f] rounded-lg hover:bg-gray-300 dark:hover:bg-[#384b3f] transition-colors"
                                        disabled={quantity >= product.stock}
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={addToCart}
                                    disabled={product.stock === 0}
                                    className="flex-1 px-8 py-4 bg-primary text-background-dark rounded-full font-bold text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                    Add to Cart
                                </button>
                                <button className="p-4 bg-gray-200 dark:bg-[#29382f] rounded-full hover:bg-gray-300 dark:hover:bg-[#384b3f] transition-colors">
                                    <span className="material-symbols-outlined">favorite</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8">
                    <h2 className="text-3xl font-bold dark:text-white mb-8">Customer Reviews</h2>

                    {/* Write a Review Section */}
                    <div className="mb-10 p-6 bg-gray-100 dark:bg-[#1a2c22] rounded-xl border-2 border-dashed border-gray-300 dark:border-[#29382f]">
                        <h3 className="text-xl font-bold dark:text-white mb-4">Share Your Experience</h3>

                        {/* Rating Selector */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Your Rating</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setUserRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <span
                                            className={`material-symbols-outlined text-4xl ${star <= (hoveredRating || userRating)
                                                ? 'text-amber-400 fill'
                                                : 'text-gray-300 dark:text-[#29382f]'
                                                }`}
                                        >
                                            star
                                        </span>
                                    </button>
                                ))}
                                {userRating > 0 && (
                                    <span className="ml-3 text-lg font-bold dark:text-white">
                                        {userRating} {userRating === 1 ? 'Star' : 'Stars'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Review Text Area */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Your Review</label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Tell us about your experience with this product..."
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#29382f] bg-white dark:bg-[#15231b] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9eb7a8] focus:ring-2 focus:ring-primary resize-none"
                            />
                            <p className="text-xs text-text-secondary mt-1">
                                {reviewText.length} / 500 characters
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitReview}
                            disabled={submittingReview}
                            className="px-6 py-3 bg-primary text-background-dark rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submittingReview ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-background-dark border-t-transparent"></div>
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">send</span>
                                    Post Review
                                </>
                            )}
                        </button>
                    </div>

                    {/* Existing Reviews */}
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="p-6 bg-gray-100 dark:bg-[#1a2c22] rounded-xl">
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 rounded-full overflow-hidden bg-gray-300 dark:bg-[#29382f] flex-shrink-0">
                                            {review.userImage ? (
                                                <img src={review.userImage} alt={review.userName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white">
                                                    {review.userName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold dark:text-white">{review.userName}</h4>
                                                <span className="text-sm text-text-secondary">
                                                    {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`material-symbols-outlined text-[16px] ${i < review.rating
                                                            ? 'text-amber-400 fill'
                                                            : 'text-gray-300 dark:text-[#29382f]'
                                                            }`}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-text-secondary mb-3">{review.comment}</p>
                                            <button className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                                                Helpful ({review.helpful})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-[#29382f] mb-4 block">rate_review</span>
                            <p className="text-text-secondary text-lg">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProductDetails;
