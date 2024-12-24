const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['recharge', 'redeem'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0, required: true },
  transactions: [transactionSchema], // Array of transactions for recharge and redeem
});
walletSchema.index({ 'transactions.type': 'text' });
// Index for efficient filtering by transaction type
walletSchema.index({ 'transactions.type': 1 });
// Index for filtering by transaction type and date
walletSchema.index({ 'transactions.type': 1, 'transactions.date': 1 });
// Index for sorting or filtering by transaction date
walletSchema.index({ 'transactions.date': 1 });

module.exports = mongoose.model('Wallet', walletSchema);
