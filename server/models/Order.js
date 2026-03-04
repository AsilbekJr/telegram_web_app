const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  telegramUserId: {
    type: String,
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
    default: 'paid', // Bot sends invoice, once paid it reaches here if checkout success (MVP simplification).
  },
  paymentId: {
    type: String,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
