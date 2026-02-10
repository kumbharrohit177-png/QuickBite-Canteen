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
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Veg Fried Rice',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Classic wok-tossed rice with crunchy vegetables and soy sauce.',
        image: 'https://images.unsplash.com/photo-1603133872878-684f10842740?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Veg Hakka Noodles',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Stir-fried noodles with julienned veggies and mild chinese spices.',
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Veg Schezwan Rice',
        price: 90,
        category: 'Lunch',
        available: true,
        description: 'Spicy fried rice tossed in fiery Schezwan sauce.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Veg Schezwan Noodles',
        price: 90,
        category: 'Lunch',
        available: true,
        description: 'Spicy noodles tossed with Schezwan sauce and veggies.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Veg Manchurian Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Fried rice served with delicious veg manchurian balls.',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Veg Triple Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Combination of rice, noodles, and rich gravy.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Veg Combination Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'A perfect blend of rice and noodles stir-fried together.',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Dal Khichdi',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Comforting mix of rice and lentils tempered with ghee and spices.',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Masala Rice',
        price: 70,
        category: 'Lunch',
        available: true,
        description: 'Rice tossed with a special blend of aromatic masalas.',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Dal Rice',
        price: 40,
        category: 'Lunch',
        available: true,
        description: 'Simple and home-style yellow dal with steamed rice.',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&q=80&w=500',
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
        image: 'https://images.unsplash.com/photo-1603133872878-684f10842740?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },
    {
        name: 'Chicken Noodles',
        price: 90,
        category: 'Lunch',
        available: true,
        description: 'Stir-fried noodles with chicken strips and veggies.',
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },
    {
        name: 'Chicken Schezwan Rice',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Spicy chicken fried rice with Schezwan sauce.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },
    {
        name: 'Chicken Schezwan Noodles',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Spicy chicken noodles tossed in Schezwan sauce.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },
    {
        name: 'Chicken Triple Rice',
        price: 140,
        category: 'Lunch',
        available: true,
        description: 'A heavy meal with chicken rice, noodles, and gravy.',
        image: 'https://images.unsplash.com/photo-1603133872878-684f10842740?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },
    {
        name: 'Combination Rice (Chicken)',
        price: 100,
        category: 'Lunch',
        available: true,
        description: 'Mixed chicken rice and noodles wok-tossed together.',
        image: 'https://images.unsplash.com/photo-1603133872878-684f10842740?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },

    // --- Dry Snacks & Starters (Veg) ---
    {
        name: 'Manchurian Dry',
        price: 100,
        category: 'Snacks',
        available: true,
        description: 'Deep-fried veggie balls tossed in tangy chinese sauces.',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Mushroom Chilli Dry',
        price: 130,
        category: 'Snacks',
        available: true,
        description: 'Crispy mushrooms tossed with onions and bell peppers.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },

    // --- South Indian & Breakfast ---
    {
        name: 'Idli Sambar',
        price: 30,
        category: 'South Indian',
        available: true,
        description: 'Soft steamed rice cakes served with spicy sambar and chutney.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Medu Vada Sambar',
        price: 35,
        category: 'South Indian',
        available: true,
        description: 'Crispy deep-fried lentil donuts served with sambar.',
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Idli Vada Sambar',
        price: 35,
        category: 'South Indian',
        available: true,
        description: 'Combo of Idli and Medu Vada with sambar.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Upma',
        price: 30,
        category: 'Snacks', // Or South Indian
        available: true,
        description: 'Savory semolina porridge with vegetables and nuts.',
        image: 'https://images.unsplash.com/photo-1550950158-d0d960d9f9dd?auto=format&fit=crop&q=80&w=500', // Placeholder
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
        image: 'https://www.indianhealthyrecipe.com/wp-content/uploads/2024/02/Misal-Pav-Instant-Pot-1.webp',
        isVeg: true
    },
    {
        name: 'Usal Pav',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Traditional chickpea or sprouts curry served with pav.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Vada Usal Pav',
        price: 50,
        category: 'Snacks',
        available: true,
        description: 'Spicy usal topped with a potato vada and served with pav.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Potato Vada (2 pcs)',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Spiced mashed potato balls deep fried in gram flour batter.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Punjabi Samosa',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Crispy pastry filled with spiced potatoes and peas.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=500',
        isVeg: true
    },
    {
        name: 'Veg Cutlet',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Crispy fried patties made of mixed vegetables.',
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Bread Pakoda',
        price: 35,
        category: 'Snacks',
        available: true,
        description: 'Bread slices stuffed with spiced potato, dipped in batter and fried.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Dhokla',
        price: 30,
        category: 'Snacks',
        available: true,
        description: 'Steamed savory cake made from gram flour, seasoned with mustard seeds.',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Sabudana Vada',
        price: 40,
        category: 'Snacks',
        available: true,
        description: 'Crispy fritters made from tapioca pearls and peanuts.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },
    {
        name: 'Sabudana Khichdi',
        price: 40,
        category: 'Snacks',
        available: true,
        description: 'Tapioca pearls cooked with peanuts, curry leaves, and chillies.',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: true
    },

    // --- Non-Veg Snacks ---
    {
        name: 'Omelette Pav',
        price: 50,
        category: 'Snacks',
        available: true,
        description: 'Fluffy 2-egg omelette served with fresh pav.',
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=500',
        isVeg: false
    },
    {
        name: 'Bhurji Pav',
        price: 60,
        category: 'Snacks',
        available: true,
        description: 'Spicy scrambled eggs with onion and tomato, served with pav.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: false
    },
    {
        name: 'Chicken Chilli Dry',
        price: 130,
        category: 'Snacks',
        available: true,
        description: 'Spicy stir-fried chicken chunks with green chillies.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=500', // Placeholder
        isVeg: false
    },
    {
        name: 'Chicken 65',
        price: 130,
        category: 'Snacks',
        available: true,
        description: 'Spicy, deep-fried chicken dish originating from Chennai.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500', // Placeholder
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
