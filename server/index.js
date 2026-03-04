const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Telegraf } = require('telegraf');
const localtunnel = require('localtunnel');
const path = require('path');
const mongoose = require('mongoose');

// DB Models
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');

dotenv.config();

// MongoDB Connection with Fallback
async function connectDB() {
  try {
    const mongoUriStr = process.env.MONGODB_URI;
    if (mongoUriStr) {
      await mongoose.connect(mongoUriStr);
      console.log('✅ MongoDB connected successfully to external URI');
    } else {
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/telegram_ecommerce', {
          serverSelectionTimeoutMS: 2000 // fast timeout for local check
        });
        console.log('✅ MongoDB connected successfully locally');
      } catch (localErr) {
        console.log('⏳ Local MongoDB not found. Starting in-memory MongoDB securely...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log('✅ In-memory MongoDB connected successfully (Fallback)');
      }
    }
    await seedDatabase();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}
const app = express();
app.use(cors());
app.use(express.json());

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../client/dist')));

const BOT_TOKEN = process.env.BOT_TOKEN;

// Initialize Telegraf Bot
if (!BOT_TOKEN) {
    console.warn("WARNING: BOT_TOKEN is not defined in .env! Bot will not start.");
}
const bot = new Telegraf(BOT_TOKEN || 'dummy_token');

async function seedDatabase() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Seeding mock products and categories...");
      await Product.insertMany([
        { title: 'iPhone 15 Pro Max 256GB', description: 'Yangi titanium dizayn, super kamera.', price: 1300, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80', category: 'Smartfonlar' },
        { title: 'Samsung Galaxy S24 Ultra', description: 'Galaxy AI imkoniyatlari bilan.', price: 1200, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80', category: 'Smartfonlar' },
        { title: 'MacBook Air M2 256GB', description: 'Yengil va kuchli Apple noutbuki.', price: 999, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80', category: 'Noutbuklar' },
        { title: 'Asus ROG Strix G16', description: 'Geymerlar uchun kuchli noutbuk.', price: 1400, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80', category: 'Noutbuklar' },
        { title: 'LG 55" OLED TV 4K', description: 'Yorqin ranglar va mukammal qora rang.', price: 1100, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80', category: 'Televizorlar' },
        { title: 'JBL Charge 5', description: 'Kuchli bassga ega portativ kalonka.', price: 150, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80', category: 'Audio' },
        { title: 'AirPods Pro 2', description: 'Aktiv shovqin bekor qiluvchi quloqchinlar.', price: 250, image: 'https://images.unsplash.com/photo-1606220588913-b3eb9ceb4ecb?auto=format&fit=crop&q=80', category: 'Aksessuarlar' },
        { title: 'Apple Watch Series 9', description: 'Sog\'liqni nazorat qilish funksiyalari bilan.', price: 400, image: 'https://images.unsplash.com/photo-1434493789847-2f02b9d2b144?auto=format&fit=crop&q=80', category: 'Smart Soatlar' },
        { title: 'Samsung NoFrost Muzlatkichi', description: 'Zamonaviy ikki kamerali muzlatkich.', price: 800, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80', category: 'Katta Maishiy' },
        { title: 'Dyson V15 Detect', description: 'Aqlli changyutgich kuchli so\'rish bilan.', price: 650, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80', category: 'Kichik Maishiy' }
      ]);
      await Category.insertMany([
        { name: 'Smartfonlar', icon: 'Smartphone', image: 'https://cdn.mediapark.uz/imgs/740be338-5558-4d3e-b7d4-87b2a64de09d_category-(13).webp' },
        { name: 'Noutbuklar', icon: 'Laptop', image: 'https://cdn.mediapark.uz/imgs/0794fdca-75fc-4228-8664-9689405d4df1_category-(14).webp' },
        { name: 'Televizorlar', icon: 'Tv', image: 'https://cdn.mediapark.uz/imgs/30d59292-6d15-4654-8c88-68c9403d6deb_category-(1).webp' },
        { name: 'Audio', icon: 'Speaker', image: 'https://cdn.mediapark.uz/imgs/5858cf9c-3151-4091-a1b6-79c9a05d4df1_category-(11).webp' },
        { name: 'Aksessuarlar', icon: 'Cable', image: 'https://cdn.mediapark.uz/imgs/fee9307f-bae1-43d2-b72f-34a372b70f64_accessories.webp' },
        { name: 'Smart Soatlar', icon: 'Watch', image: 'https://cdn.mediapark.uz/imgs/620be338-5558-4d3e-b7d4-87b2a64de09d_watch.webp' },
        { name: 'Katta Maishiy', icon: 'Refrigerator', image: 'https://cdn.mediapark.uz/imgs/5e3c44a0-127e-4814-91f6-ec7797c87dc3_fridge.webp' },
        { name: 'Kichik Maishiy', icon: 'WashingMachine', image: 'https://cdn.mediapark.uz/imgs/8f85ec27-b643-427c-9f66-f0f38b8e92cd_category-(12).webp' }
      ]);
      console.log("Seeding complete!");
    }
  } catch (err) {
    console.error("Seeding Error:", err);
  }
}

// Admin Auth Middleware
const adminAuth = (req, res, next) => {
    const adminId = req.headers['x-admin-id'];
    const envAdmins = process.env.ADMIN_TELEGRAM_IDS;
    
    // If no admins are set in .env, we warn but allow for easy test/initial setup. 
    // In production, the user MUST set ADMIN_TELEGRAM_IDS to secure it.
    if (!envAdmins) {
        console.warn("WARNING: ADMIN_TELEGRAM_IDS is not set in .env! Admin routes are accessible by anyone.");
        return next();
    }
    
    const allowedAdmins = envAdmins.split(',').map(id => id.trim());
    if (adminId && allowedAdmins.includes(adminId)) {
        return next();
    }
    
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
};

// REST API endpoint to get products from MongoDB
app.get('/api/products', async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};
        
        if (category) {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const dbProducts = await Product.find(query).lean();
        // The frontend expects `id` instead of `_id`, so we map it cleanly.
        const formatted = dbProducts.map(p => ({
            ...p,
            id: p._id.toString()
        }));
        res.json(formatted);
    } catch (error) {
        console.error('Products API Error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Admin API: Create a product
app.post('/api/products', adminAuth, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json({ ...saved.toObject(), id: saved._id.toString() });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create product', details: error.message });
    }
});

// Admin API: Update a product
app.put('/api/products/:id', adminAuth, async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Product not found' });
        res.json({ ...updated.toObject(), id: updated._id.toString() });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update product', details: error.message });
    }
});

// Admin API: Delete a product
app.delete('/api/products/:id', adminAuth, async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Admin API: Get all orders
app.get('/api/orders', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Categories API
app.get('/api/categories', async (req, res) => {
    try {
        const dbCategories = await Category.find().lean();
        const formatted = dbCategories.map(c => ({
            ...c,
            id: c._id.toString()
        }));
        res.json(formatted);
    } catch (error) {
        console.error('Categories API Error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

app.post('/api/categories', adminAuth, async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        const saved = await newCategory.save();
        res.status(201).json({ ...saved.toObject(), id: saved._id.toString() });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create category', details: error.message });
    }
});

app.delete('/api/categories/:id', adminAuth, async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Category not found' });
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

const crypto = require('crypto');

// Function to validate Telegram initData
function validateInitData(initData, botToken) {
    if (!initData) return false;

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
}

// Create Invoice/Checkout endpoint
app.post('/api/checkout', async (req, res) => {
    const { items, totalAmount, userId, initData } = req.body;
    
    try {
        console.log("Received checkout request:", { userId, totalAmount, itemsCount: items?.length });

        if (!userId || !initData) {
             return res.status(400).json({ success: false, error: 'User identity or initData missing. Open the bot carefully.'});
        }

        // Validate that the request came from our Telegram Web App
        const isValid = validateInitData(initData, BOT_TOKEN);
        if (!isValid) {
            console.error("Invalid initData received!");
            return res.status(401).json({ success: false, error: 'Unauthorized request. Cannot verify Web App origin.' });
        }

        // Telegram Stars requires the price to be an integer (1 Star = 1 unit)
        const totalStars = Math.max(1, Math.round(totalAmount));
        const prices = [{ label: 'Total Order (Stars)', amount: totalStars }];

        const invoicePayload = `order_${Date.now()}_${userId}`;
        
        // Save the Order to MongoDB
        const newOrder = new Order({
            telegramUserId: String(userId),
            items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
            totalAmount: totalAmount,
            status: 'pending',
            paymentId: invoicePayload
        });
        await newOrder.save();
        console.log(`Saved pending order ${newOrder._id} into MongoDB!`);

        await bot.telegram.sendInvoice(userId, {
            title: `Mini App Checkout`,
            description: `Payment for ${items.length} items from our shop. Total: $${totalAmount.toFixed(2)}`,
            payload: invoicePayload,
            provider_token: '',
            currency: 'XTR',
            prices: prices
        });

        res.status(200).json({ success: true, message: "Invoice sent to chat and order saved." });
    } catch (e) {
        console.error("API Checkout Error:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// React Router fallback (Catch-all for SPA)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', async () => {
        console.log(`Server is running on port ${PORT}`);
        
        bot.start((ctx) => {
            ctx.reply('Welcome to our Mini E-commerce Shop! 🛒\nClick the button below to start shopping.', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Open Shop", web_app: { url: process.env.WEB_APP_URL } }]
                    ]
                }
            });
        });

        bot.command('admin', (ctx) => {
            const adminUrl = process.env.WEB_APP_URL ? `${process.env.WEB_APP_URL}/admin` : '';
            if(!adminUrl) return;
            ctx.reply('Admin paneliga kirish:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "⚙️ Admin Panel", web_app: { url: adminUrl } }]
                    ]
                }
            });
        });

        if (BOT_TOKEN) {
            // Update the main menu button automatically so the user always has the latest valid URL without needing /start again
            bot.telegram.setChatMenuButton({
                menu_button: {
                    type: 'web_app',
                    text: 'Open Shop 🛒',
                    web_app: { url: process.env.WEB_APP_URL }
                }
            }).catch(e => console.error("Failed to set menu button:", e.message));

            bot.launch({ dropPendingUpdates: true })
                .then(() => {
                    console.log("Telegram bot is running in polling mode.");
                })
                .catch(err => console.error("Bot launch failed:", err.message));
        }
    });
}).catch(err => {
    console.error("Critical Failure: Could not connect to DB and fallback failed.", err);
    process.exit(1);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
