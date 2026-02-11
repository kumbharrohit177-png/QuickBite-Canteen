const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const sampleItems = [
    // --- Veg Rice & Noodles (Lunch) ---
    {
        name: 'Veg Dum Biryani',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Flavorful basmati rice cooked with mixed vegetables and aromatic spices.',
        image: '/images/VegDumBiryani.jpg',
        isVeg: true
    },
    {
        name: 'Veg Fried Rice',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Classic wok-tossed rice with crunchy vegetables and soy sauce.',
        image: '/images/VegFriedRice.png',
        isVeg: true
    },
    {
        name: 'Veg Hakka Noodles',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Stir-fried noodles with julienned veggies and mild chinese spices.',
        image: '/images/VegHakkaNoodles.jpg',
        isVeg: true
    },
    {
        name: 'Veg Schezwan Rice',
        price: 90,
        category: 'Lunch',
        available: true,
        description: 'Spicy fried rice tossed in fiery Schezwan sauce.',
        image: '/images/VegSchezwanRice.jpg',
        isVeg: true
    },
    {
        name: 'Veg Schezwan Noodles',
        price: 90,
        category: 'Lunch',
        available: true,
        description: 'Spicy noodles tossed with Schezwan sauce and veggies.',
        image: '/images/VegSchezwanNoodles.jpg',
        isVeg: true
    },
    {
        name: 'Veg Manchurian Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Fried rice served with delicious veg manchurian balls.',
        image: '/images/VegManchurian Rice.png',
        isVeg: true
    },
    {
        name: 'Veg Triple Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Combination of rice, noodles, and rich gravy.',
        image: '/images/VegTripleRice.png',
        isVeg: true
    },
    {
        name: 'Veg Combination Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'A perfect blend of rice and noodles stir-fried together.',
        image: '/images/VegCombinationRice.jpg',
        isVeg: true
    },
    {
        name: 'Dal Khichdi',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Comforting mix of rice and lentils tempered with ghee and spices.',
        image: '/images/DalKhichdi.jpg',
        isVeg: true
    },
    {
        name: 'Masala Rice',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Rice tossed with a special blend of aromatic masalas.',
        image: '/images/MasalaRice.png',
        isVeg: true
    },
    {
        name: 'Dal Rice',
        price: 40,
        category: 'Lunch',
        available: true,
        description: 'Simple and home-style yellow dal with steamed rice.',
        image: '/images/DalRice.jpg',
        isVeg: true
    },

    // --- Non-Veg Rice & Noodles (Lunch) ---
    {
        name: 'Chicken Dum Biryani',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Rich and aromatic biryani with succulent chicken pieces.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },
    {
        name: 'Chicken Fried Rice',
        price: 90,
        category: 'Lunch',
        available: true,
        description: 'Wok-tossed rice with egg, chicken, and veggies.',
        image: '/images/ChickenFriedRice.jpg',
        isVeg: false
    },
    {
        name: 'Chicken Noodles',
        price: 90,
        category: 'Lunch',
        available: true,
        description: 'Stir-fried noodles with chicken strips and veggies.',
        image: '/images/ChickenNoodles.jpg',
        isVeg: false
    },
    {
        name: 'Chicken Schezwan Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Spicy chicken fried rice with Schezwan sauce.',
        image: '/images/ChickenFriedRice.jpg',
        isVeg: false
    },
    {
        name: 'Chicken Schezwan Noodles',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Spicy chicken noodles tossed in Schezwan sauce.',
        image: '/images/ChickenSchezwan Noodles.jpg',
        isVeg: false
    },
    {
        name: 'Chicken Triple Rice',
        price: 140,
        category: 'Lunch',
        available: true,
        description: 'A heavy meal with chicken rice, noodles, and gravy.',
        image: '/images/ChickenTripleRice.jpeg',
        isVeg: false
    },
    {
        name: 'Combination Rice (Chicken)',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Mixed chicken rice and noodles wok-tossed together.',
        image: '/images/CombinationRice.jpg',
        isVeg: false
    },

    // --- Dry Snacks & Starters (Veg) ---
    {
        name: 'Manchurian Dry',
        price: 100,
        category: 'Snacks',
        available: true,
        description: 'Deep-fried veggie balls tossed in tangy chinese sauces.',
        image: '/images/ManchurianDry.webp',
        isVeg: true
    },
    {
        name: 'Mushroom Chilli Dry',
        price: 130,
        category: 'Snacks',
        available: true,
        description: 'Crispy mushrooms tossed with onions and bell peppers.',
        image: '/images/MushroomChilli Dry.jpg',
        isVeg: true
    },

    // --- South Indian & Breakfast ---
    {
        name: 'Idli Sambar',
        price: 30,
        category: 'South Indian',
        available: true,
        description: 'Soft steamed rice cakes served with spicy sambar and chutney.',
        image: '/images/IdliSambar.webp',
        isVeg: true
    },
    {
        name: 'Medu Vada Sambar',
        price: 35,
        category: 'South Indian',
        available: true,
        description: 'Crispy deep-fried lentil donuts served with sambar.',
        image: '/images/MeduVadaSambar.jpg',
        isVeg: true
    },
    {
        name: 'Idli Vada Sambar',
        price: 35,
        category: 'South Indian',
        available: true,
        description: 'Combo of Idli and Medu Vada with sambar.',
        image: '/images/IdliVadaSambar.jpg',
        isVeg: true
    },
    {
        name: 'Upma',
        price: 30,
        category: 'Snacks', // Or South Indian
        available: true,
        description: 'Savory semolina porridge with vegetables and nuts.',
        image: '/images/Upma.jpg',
        isVeg: true
    },
    {
        name: 'Poha',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Flattened rice cooked with turmeric, onions, and peanuts.',
        image: '/images/poha.jpg.jpeg', // Updated to local image
        isVeg: true
    },

    // --- Maharashtrian & Street Food ---
    {
        name: 'Misal Pav',
        price: 50,
        category: 'Snacks',
        available: true,
        description: 'Spicy sprouted curry topped with farsan, served with pav.',
        image: '/images/MisalPav.jpg',
        isVeg: true
    },
    {
        name: 'Usal Pav',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Traditional chickpea or sprouts curry served with pav.',
        image: '/images/UsalPav.jpg',
        isVeg: true
    },
    {
        name: 'Vada Usal Pav',
        price: 50,
        category: 'Snacks',
        available: true,
        description: 'Spicy usal topped with a potato vada and served with pav.',
        image: '/images/VadaUsalPav.jpg',
        isVeg: true
    },
    {
        name: 'Potato Vada (2 pcs)',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Spiced mashed potato balls deep fried in gram flour batter.',
        image: '/images/PotatoVada.jpg',
        isVeg: true
    },
    {
        name: 'Punjabi Samosa',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Crispy pastry filled with spiced potatoes and peas.',
        image: '/images/PunjabiSamosa.webp',
        isVeg: true
    },
    {
        name: 'Veg Cutlet',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Crispy fried patties made of mixed vegetables.',
        image: '/images/VegCutlet.jpg',
        isVeg: true
    },
    {
        name: 'Bread Pakoda',
        price: 35,
        category: 'Snacks',
        available: true,
        description: 'Bread slices stuffed with spiced potato, dipped in batter and fried.',
        image: '/images/BreadPakoda.jpg',
        isVeg: true
    },
    {
        name: 'Dhokla',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Steamed savory cake made from gram flour, seasoned with mustard seeds.',
        image: '/images/Dhokla.jpg',
        isVeg: true
    },
    {
        name: 'Sabudana Vada',
        price: 40,
        category: 'Snacks',
        available: true,
        description: 'Crispy fritters made from tapioca pearls and peanuts.',
        image: '/images/SabudanaVada.jpg',
        isVeg: true
    },
    {
        name: 'Sabudana Khichdi',
        price: 40,
        category: 'Snacks',
        available: true,
        description: 'Tapioca pearls cooked with peanuts, curry leaves, and chillies.',
        image: '/images/SabudanaKhichdi.jpg',
        isVeg: true
    },

    // --- Non-Veg Snacks ---
    {
        name: 'Omelette Pav',
        price: 50,
        category: 'Snacks',
        available: true,
        description: 'Fluffy 2-egg omelette served with fresh pav.',
        image: '/images/OmelettePav.jpg',
        isVeg: false
    },
    {
        name: 'Bhurji Pav',
        price: 60,
        category: 'Snacks',
        available: true,
        description: 'Spicy scrambled eggs with onion and tomato, served with pav.',
        image: '/images/BhurjiPav.jpg',
        isVeg: false
    },
    {
        name: 'Chicken Chilli Dry',
        price: 130,
        category: 'Snacks',
        available: true,
        description: 'Spicy stir-fried chicken chunks with green chillies.',
        image: '/images/ChickenChilliDry.jpg',
        isVeg: false
    },
    {
        name: 'Chicken 65',
        price: 130,
        category: 'Snacks',
        available: true,
        description: 'Spicy, deep-fried chicken dish originating from Chennai.',
        image: '/images/Chicken65.jpg',
        isVeg: false
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        await FoodItem.deleteMany({});
        console.log('🧹 Cleared existing items');

        await FoodItem.insertMany(sampleItems);
        console.log('✅ Added sample food items');

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
