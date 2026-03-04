const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Mirrorless', 'DSLR', 'Accessories'],
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    specifications: {
        type: Map,
        of: String
    },
    features: [{
        type: String
    }],
    keyHighlights: [{
        type: String
    }],
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: String,
        userEmail: String,
        userImage: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
        helpful: { type: Number, default: 0 }
    }]
}, {
    timestamps: true
});

// Index for faster category queries
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
