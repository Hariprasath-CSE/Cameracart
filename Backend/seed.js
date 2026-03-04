const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    // Mirrorless Cameras
    {
        name: 'Sony Alpha a7 IV',
        brand: 'Sony',
        category: 'Mirrorless',
        price: 2498.00,
        originalPrice: 2698.00,
        description: '33MP Full-Frame Exmor R CMOS Sensor, BIONZ XR Image Processor.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeVZMZrW3RGwx6dE0j-pxVa0AVJK-3p31DU_3LP-Q-YigeS-NB_8zFiV5_623pxjO7bdHXFVVbqZbmSjkj0PWLJ8qHYGT_Ga4PuV0_AKmgyvbYEPgiu3a1S7jIPafa3kiJQroPK61asM_dJEJq--nNPRtnp6NH_MJYXSAqzvo9Vilux5GeuWpUnhRo_BdBECof9cVrp2-s2cGdPf2He2D465Pm7Y0FDHw8B0vzoqhDrzfgw9oiRk5b_ZvbFAyYZeuhuvYvjgcQdqK1',
        rating: 4.8,
        reviewCount: 247,
        stock: 15,
        keyHighlights: [
            '33MP full-frame sensor delivers exceptional detail and dynamic range',
            'Advanced AI-powered autofocus with Real-time Eye AF for humans and animals',
            '10fps continuous shooting with full AF/AE tracking',
            '4K 60p video recording with 10-bit 4:2:2 color sampling',
            'Enhanced in-body 5-axis image stabilization (up to 5.5 stops)',
            'Improved ergonomics with redesigned menu system'
        ],
        features: [
            'BSI CMOS Image Sensor: Back-illuminated design for improved low-light performance and higher dynamic range',
            'BIONZ XR Processor: Up to 8x more processing power for faster operation and advanced AI features',
            'Dual CFexpress/SD Card Slots: Flexible storage options with high-speed recording capabilities',
            '3.68M-Dot OLED Electronic Viewfinder: High-resolution EVF with 120fps refresh rate for smooth viewing',
            'Vari-Angle Touchscreen LCD: Fully articulating 3" display perfect for creative angles and vlogging',
            'Professional Video Features: S-Log3, S-Cinetone, and 4K 60p internal recording',
            'Weather-Sealed Magnesium Body: Dust and moisture resistant construction for reliable performance',
            'Long Battery Life: Up to 580 shots per charge with Z battery',
            'Multiple Connectivity Options: USB-C, Wi-Fi 802.11ac, Bluetooth 5.0, and optional remote control'
        ],
        reviews: [
            {
                userName: 'Michael Chen',
                userImage: 'https://i.pravatar.cc/150?img=12',
                rating: 5,
                comment: 'This camera is absolutely phenomenal! The image quality is outstanding, and the autofocus is incredibly fast and accurate. Perfect for both photography and video work. Worth every penny!',
                date: 'Jan 15, 2026',
                helpful: 89
            },
            {
                userName: 'Sarah Johnson',
                userImage: 'https://i.pravatar.cc/150?img=45',
                rating: 5,
                comment: 'Upgraded from the a7 III and the improvements are noticeable everywhere. The new menu system is much more intuitive, battery life is excellent, and the video capabilities are professional-grade.',
                date: 'Jan 10, 2026',
                helpful: 67
            },
            {
                userName: 'David Martinez',
                userImage: 'https://i.pravatar.cc/150?img=33',
                rating: 4,
                comment: 'Great all-around camera. The only minor downside is the file sizes with 33MP, but that\'s expected. The autofocus in video mode is a game-changer for content creators.',
                date: 'Jan 5, 2026',
                helpful: 45
            },
            {
                userName: 'Emma Thompson',
                userImage: 'https://i.pravatar.cc/150?img=26',
                rating: 5,
                comment: 'Best hybrid camera I\'ve ever owned. Shoots stunning photos and 4K video without breaking a sweat. The in-body stabilization is incredible for handheld work.',
                date: 'Dec 28, 2025',
                helpful: 52
            }
        ]
    },
    {
        name: 'Nikon Z6 II',
        brand: 'Nikon',
        category: 'Mirrorless',
        price: 1996.95,
        description: '24.5MP FX-Format BSI CMOS Sensor, Dual EXPEED 6 Image Processors.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPhQ8DtQlCd68UE7ZYvpEouN7ZLU5U_j8749BzXNJ-xQpxg2FbiDoJrMiWWPbIweNpjL5cE1eYglyYTWEofq4jqljW5Yl-DQqXkl1mNHdEciowGb2SRas0IfSdfApmrB2OVAZprPlVirZ-1MYGNEMUNJ2opfaZZ7HAJQ4tLE8GYISDJyunorEyUVHa_TnvC2q5o3QEVDIFMLfOGzsDm3LbGTlpuSNQkz3Gz19sBZCWcKy0euYB889zzpAEreLCuTnNv3psRaZf_yIQ',
        rating: 4.7,
        stock: 12
    },
    {
        name: 'Fujifilm X-T4',
        brand: 'Fujifilm',
        category: 'Mirrorless',
        price: 1699.00,
        description: '26.1MP APS-C X-Trans BSI CMOS 4 Sensor, X-Processor 4 Image Processor.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9TC2FIzfnCGtEuKNw9GdovVy1plcJxsqTVUUYaj0pjwfMAyM0cz9UYz4ryJ6XJZZCxwsrsqAHxntglJxGPmm4Z2l1UwbNCY6hlso6vB6A2Sfs2gIpUiqCRVHrcdjB6qif95IDgi0vpdlZCrT5oaK1Og7muPqpB76ro4t8Tjsq3WBEfQR4W4OMH3yzlPueSn31juV_G9XOS7GBKMOnHZJGFWZ-vacpv-vWb4LzEufygI3UBaKzwghQLuwXoooQnbp_BTTvNsnCweGC',
        rating: 4.8,
        stock: 20
    },

    // DSLR Cameras
    {
        name: 'Canon EOS R5',
        brand: 'Canon',
        category: 'DSLR',
        price: 3899.00,
        description: '45MP Full-Frame CMOS Sensor, 8K30 Raw and 4K120 10-Bit Internal Video.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp2-WUvt30c4CC37dVN4ZMl21b2RvI1Bix_iziBZBDuoLKtipasgo9x1wnrvmVXMBPh6Rklsl2CAhuRSgPEmBg0g7s11D557e1hTpznx0hqIGawymxg1YnWETP-XYXoiyQ1HOQPKDxzH83ZunMroAxuB9DCXfCeZYi4ORNpwCLZ3rqMewt066ZQv3pryTBZIeiETD_ciNHLjWJaoJXAiBPN2BitYcnqgifPVmqw60imIAxtnBWK4wNa1iDmMQCPgP8tP5K6V2p3lPh',
        rating: 4.9,
        stock: 8
    },
    {
        name: 'Nikon D850',
        brand: 'Nikon',
        category: 'DSLR',
        price: 2996.95,
        description: '45.7MP FX-Format CMOS Sensor, EXPEED 5 Image Processor, 4K UHD Video.',
        image: 'https://images.unsplash.com/photo-1606983340126-99ab4716b5e8?w=400',
        rating: 4.8,
        stock: 10
    },

    {
        name: 'Canon EOS R6 Mark II',
        brand: 'Canon',
        category: 'Mirrorless',
        price: 2499.00,
        description: '24.2MP Full-Frame CMOS Sensor, DIGIC X Image Processor, 40 fps Continuous Shooting.',
        image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=400&fit=crop',
        rating: 4.9,
        stock: 14
    },
    {
        name: 'Panasonic Lumix GH6',
        brand: 'Panasonic',
        category: 'Mirrorless',
        price: 2197.99,
        description: '25.2MP Micro Four Thirds Sensor, 5.7K 60p ProRes 422 HQ Video Recording.',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
        rating: 4.7,
        stock: 11
    },
    {
        name: 'Olympus OM-1',
        brand: 'Olympus',
        category: 'Mirrorless',
        price: 2199.99,
        description: '20MP Stacked BSI Live MOS Sensor, 120fps Shooting, Advanced AI Subject Detection.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
        rating: 4.6,
        stock: 9
    },
    {
        name: 'Canon EOS RP',
        brand: 'Canon',
        category: 'Mirrorless',
        price: 999.00,
        originalPrice: 1299.00,
        description: '26.2MP Full-Frame CMOS Sensor, DIGIC 8 Image Processor, Compact Lightweight Body.',
        image: 'https://images.unsplash.com/photo-1606983340126-99ab4716b5e8?w=400&h=400&fit=crop',
        rating: 4.5,
        stock: 18
    },

    // More DSLR Cameras
    {
        name: 'Canon EOS 90D',
        brand: 'Canon',
        category: 'DSLR',
        price: 1199.00,
        description: '32.5MP APS-C CMOS Sensor, DIGIC 8 Image Processor, 10 fps Continuous Shooting.',
        image: 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=400&h=400&fit=crop',
        rating: 4.7,
        stock: 16
    },
    {
        name: 'Nikon D780',
        brand: 'Nikon',
        category: 'DSLR',
        price: 2296.95,
        description: '24.5MP FX-Format BSI CMOS Sensor, EXPEED 6 Image Processor, Hybrid AF System.',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
        rating: 4.8,
        stock: 13
    },
    {
        name: 'Pentax K-1 Mark II',
        brand: 'Pentax',
        category: 'DSLR',
        price: 1796.95,
        description: '36.4MP Full-Frame CMOS Sensor, PRIME IV Image Processor, 5-Axis Shake Reduction.',
        image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=400&fit=crop&sat=-10',
        rating: 4.6,
        stock: 7
    },

    // Action Cameras
    {
        name: 'GoPro HERO12 Black',
        brand: 'GoPro',
        category: 'DSLR',
        price: 399.99,
        description: '5.3K60 Video, HDR Photo & Video, HyperSmooth 6.0 Stabilization, Waterproof to 33ft.',
        image: 'https://images.unsplash.com/photo-1585556664278-1094b00ba51f?w=400&h=400&fit=crop',
        rating: 4.8,
        stock: 35
    },
    {
        name: 'DJI Osmo Action 4',
        brand: 'DJI',
        category: 'DSLR',
        price: 349.00,
        description: '4K120fps Video, 155° Ultra-Wide FOV, 10-Bit & D-Log M Color Performance.',
        image: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=400&h=400&fit=crop',
        rating: 4.7,
        stock: 28
    },

    // Compact Cameras
    {
        name: 'Sony RX100 VII',
        brand: 'Sony',
        category: 'Mirrorless',
        price: 1298.00,
        description: '20.1MP 1" Exmor RS CMOS Sensor, 24-200mm Zeiss Lens, 4K HDR Video.',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop&sat=-20',
        rating: 4.7,
        stock: 21
    },
    {
        name: 'Canon PowerShot G7 X Mark III',
        brand: 'Canon',
        category: 'Mirrorless',
        price: 749.00,
        description: '20.1MP 1" Stacked CMOS Sensor, 24-100mm f/1.8-2.8 Lens, 4K30 Video, Live Streaming.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&sat=-15',
        rating: 4.6,
        stock: 24
    },

    // Instant Cameras
    {
        name: 'Fujifilm Instax Mini 12',
        brand: 'Fujifilm',
        category: 'Mirrorless',
        price: 79.95,
        description: 'Instant Film Camera with Built-in Flash, Close-up Mode, Available in Multiple Colors.',
        image: 'https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=400&h=400&fit=crop',
        rating: 4.5,
        stock: 45
    },
    {
        name: 'Polaroid Now+ Gen 2',
        brand: 'Polaroid',
        category: 'Mirrorless',
        price: 149.99,
        description: 'i-Type Instant Camera with Bluetooth Connectivity, Manual Mode, Double Exposure.',
        image: 'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=400&h=400&fit=crop',
        rating: 4.4,
        stock: 32
    },

    // Accessories
    {
        name: 'Sigma 24-70mm f/2.8',
        brand: 'Sigma',
        category: 'Accessories',
        price: 1099.00,
        description: 'DG DN Art Lens for Sony E. Versatile wide-angle to portrait.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkByBoeu9RMlxB9PpDOvyC8nLtUOddCFPdJP36ikLPdEf3wrpyOnni_mDfWL1EydmUHzebmOh4bOWDeltF89nfUv79XWczxls1edCFYMXZsrzaQNk9GmIoD2JgnMnY3cUFRfiqI0gJaoASgzcaFVqbnsVyLFqFI7f7h6zddu1IOWtLCFgR9B3EaEhSlU-nxEbn44OEF1qd3z8y1jEqGPcHKeEYQ04bVqWsXi8pj_Kg-y4u1CM_YotHtvAi-PjF6vSfx84gL2XFOQz3',
        rating: 4.6,
        stock: 25
    },
    {
        name: 'Canon RF 50mm f/1.2 L',
        brand: 'Canon',
        category: 'Accessories',
        price: 2299.00,
        description: 'USM Lens. A bright, professional prime lens delivering supreme sharpness.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMwn19W0llEMf0DAGOmzwYnCBmcOC4MonM6MmcrGNmMQ_ZFnf5W7Sf-zSNQIDQn1vE5eu6ZcWDjqS_uVl7nROsbeYospUdQGh74_NDmrI2P6O1VOXMBuLb0pDS1z3uN62Y4OtuAdWQPgDyDUl40igQ6SBfstvJb1o2qBvB_qRTL8x3HtA0b970X--ncRmdsrQVyYT_Jj1MUdAfAWLwC4W2BX7GW-4ddWYdqziXzmRzKgyvAl6ofZ35GTUqChic2pZEWCjdBa2x9m_Q',
        rating: 5.0,
        stock: 18
    },
    {
        name: 'Sony FE 85mm f/1.4 GM',
        brand: 'Sony',
        category: 'Accessories',
        price: 1798.00,
        description: 'The ultimate portrait lens with stunning bokeh and resolution.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3MN5gE6FAd58kPNcV6v7B-ehE3yDH6J6_rAbqY0eSsw68ETM9Vb0qEr6zgdduaLBRjvCjTfWDNOuaKa97oT6GU544Z6mzm29qGjyzpk0Z1bHxWNp9A7skhvLuyU9K2g1aiKMM50tS1xNS6Nar94bJMfg4ITgIm9sWix9sXFMBKfM0ez4YpkbYQJ5tBUKHMlwcMuDRDa3ZEsnqNKcUuarlVPUHrbmMG_UF9apoWvY1nMX_QbbFc3qiRoRLQpYjNS60gSLmmDqdYfYU',
        rating: 4.8,
        stock: 22
    },
    {
        name: 'Manfrotto Professional Tripod',
        brand: 'Manfrotto',
        category: 'Accessories',
        price: 299.00,
        description: 'Heavy-duty aluminum tripod with ball head. Max load 17.6 lbs.',
        image: 'https://images.unsplash.com/photo-1606402179428-a57976e71fa4?w=400',
        rating: 4.5,
        stock: 30
    },
    {
        name: 'SanDisk Extreme PRO 128GB',
        brand: 'SanDisk',
        category: 'Accessories',
        price: 89.99,
        description: 'SD UHS-I Card - C10, U3, V30, 4K UHD, 170MB/s Read, 90MB/s Write.',
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400',
        rating: 4.7,
        stock: 50
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
