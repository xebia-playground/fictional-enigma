require('dotenv').config();

const mongoose = require('mongoose');

const Product = require('./models/Product');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devshop_codeql_demo';

const catalogTemplates = [
  {
    category: 'electronics',
    products: ['Wireless Headphones', 'Bluetooth Speaker', 'Smart Watch', 'USB-C Dock', 'Mechanical Keyboard'],
    descriptors: ['noise-canceling', 'compact', 'premium', 'fast-charging', 'travel-ready'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    basePrice: 79,
  },
  {
    category: 'home-office',
    products: ['Studio Desk Lamp', 'Ergonomic Chair', 'Monitor Stand', 'Cable Organizer', 'Writing Desk'],
    descriptors: ['minimal', 'adjustable', 'space-saving', 'sturdy', 'modern'],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    basePrice: 45,
  },
  {
    category: 'kitchen',
    products: ['Pour Over Coffee Kit', 'Ceramic Dinner Set', 'Chef Knife', 'Bamboo Cutting Board', 'Insulated Tumbler'],
    descriptors: ['daily-use', 'artisan', 'durable', 'easy-clean', 'gift-ready'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    basePrice: 28,
  },
  {
    category: 'travel',
    products: ['Canvas Weekender Bag', 'Packing Cube Set', 'Neck Pillow', 'Passport Wallet', 'Carry-On Backpack'],
    descriptors: ['weather-resistant', 'lightweight', 'organized', 'secure', 'weekend-ready'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    basePrice: 38,
  },
  {
    category: 'fitness',
    products: ['Yoga Mat', 'Resistance Band Set', 'Hydration Bottle', 'Training Duffel', 'Foam Roller'],
    descriptors: ['non-slip', 'portable', 'sweat-proof', 'high-grip', 'recovery-focused'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    basePrice: 24,
  },
  {
    category: 'fashion',
    products: ['Cotton Overshirt', 'Leather Belt', 'Everyday Sneakers', 'Linen Scarf', 'Canvas Tote'],
    descriptors: ['tailored', 'soft-touch', 'classic', 'seasonal', 'versatile'],
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
    basePrice: 34,
  },
  {
    category: 'beauty',
    products: ['Vitamin C Serum', 'Clay Face Mask', 'Body Lotion', 'Grooming Kit', 'Daily Sunscreen'],
    descriptors: ['gentle', 'hydrating', 'clean-formula', 'brightening', 'daily-care'],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
    basePrice: 18,
  },
  {
    category: 'outdoor',
    products: ['Trail Lantern', 'Camp Blanket', 'Hiking Daypack', 'Portable Cooler', 'Picnic Rug'],
    descriptors: ['rugged', 'packable', 'water-resistant', 'all-weather', 'adventure-ready'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    basePrice: 31,
  },
  {
    category: 'books',
    products: ['Design Notebook', 'Cookbook Collection', 'Travel Journal', 'Business Planner', 'Sketch Pad'],
    descriptors: ['hardcover', 'illustrated', 'archival-paper', 'desk-friendly', 'giftable'],
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
    basePrice: 14,
  },
  {
    category: 'gaming',
    products: ['RGB Mouse', 'Controller Stand', 'Gaming Headset', 'Desk Mat', 'Streaming Light'],
    descriptors: ['low-latency', 'tournament-ready', 'immersive', 'precision-built', 'stream-ready'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    basePrice: 49,
  },
];

const colors = ['Slate', 'Forest', 'Amber', 'Graphite', 'Ivory', 'Ocean'];

const products = Array.from({ length: 300 }, (_, index) => {
  const template = catalogTemplates[index % catalogTemplates.length];
  const productName = template.products[index % template.products.length];
  const descriptor = template.descriptors[index % template.descriptors.length];
  const color = colors[index % colors.length];
  const edition = Math.floor(index / template.products.length) + 1;
  const price = template.basePrice + (index % 17) * 6 + Math.floor(index / 30) * 3;

  return {
    title: `${color} ${productName} ${edition}`,
    description: `A ${descriptor} ${productName.toLowerCase()} from the ${template.category} collection, built for everyday shopping demo flows.`,
    price,
    category: template.category,
    stock: 8 + (index % 43),
    image: template.image,
  };
});

const seed = async () => {
  await mongoose.connect(mongoUri);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});