const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Telegraf } = require('telegraf');
const localtunnel = require('localtunnel');
const path = require('path');

dotenv.config();

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

// Mock products data (to act as pseudo-database)
const products = [
  { id: '1', title: 'Premium Wireless Headphones', description: 'High-quality sound with ANC.', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', category: 'Electronics' },
  { id: '2', title: 'Smart Watch Series 7', description: 'Track your fitness.', price: 299.00, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800', category: 'Electronics' },
  { id: '3', title: 'Organic Cotton T-Shirt', description: 'Breathable organic cotton.', price: 24.50, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', category: 'Clothing' },
  { id: '4', title: 'Leather Messenger Bag', description: 'Handcrafted leather bag.', price: 145.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', category: 'Accessories' },
  { id: '5', title: 'Eco-Friendly Water Bottle', description: 'Insulated stainless steel.', price: 35.00, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800', category: 'Lifestyle' },
  { id: '6', title: 'Professional Camera Lens', description: '50mm f/1.8 prime lens.', price: 125.00, image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800', category: 'Photography' }
];

// REST API endpoint to get products
app.get('/api/products', (req, res) => {
    res.json(products);
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

        await bot.telegram.sendInvoice(userId, {
            title: `Mini App Checkout`,
            description: `Payment for ${items.length} items from our shop. Total: $${totalAmount.toFixed(2)}`,
            payload: `order_${Date.now()}`,
            provider_token: '',
            currency: 'XTR',
            prices: prices
        });

        res.status(200).json({ success: true, message: "Invoice sent to chat successfully." });
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

app.listen(PORT, async () => {
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

    if (BOT_TOKEN) {
        bot.launch().then(() => {
            console.log("Telegram bot is running in polling mode.");
        });
    }
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
