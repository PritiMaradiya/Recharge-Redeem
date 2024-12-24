const express = require("express");
const jwt = require("jsonwebtoken");
const Wallet = require("../Model/Wallet");
const { body, validationResult } = require("express-validator");
const { authenticateToken } = require("../Middleware/authenticateToken");
const router = express.Router();

router.post(
  "/recharge",
  [
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a positive number"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  authenticateToken,
  async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.id;

      let wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        wallet = new Wallet({ userId, balance: amount, transactions: [] });
      } else {
        wallet.balance += amount;
      }

      // Log the transaction
      wallet.transactions.push({ type: "recharge", amount });
      await wallet.save();

      res
        .status(200)
        .json({ message: "Recharge successful", balance: wallet.balance });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.post(
  "/redeem",
  [
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a positive number"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  authenticateToken,
  async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.id;

      const wallet = await Wallet.findOne({ userId });
      if (!wallet || wallet.balance < amount) {
        return res
          .status(400)
          .json({ message: "Insufficient balance or wallet not found" });
      }

      wallet.balance -= amount;

      // Log the transaction
      wallet.transactions.push({ type: "redeem", amount });
      await wallet.save();

      res
        .status(200)
        .json({ message: "Redeem successful", balance: wallet.balance });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.get('/details-transactions', authenticateToken, async (req, res) => {
  try {
      const { page = 1, perPage = 10, q, type } = req.query;

      // Fetch wallet for the authenticated user
      let wallet = await Wallet.findOne({ userId: req.user.id });

      // If no wallet is found, create a new one with a balance of 0
      if (!wallet) {
          wallet = new Wallet({
              userId: req.user.id,
              balance: 0,
              transactions: [],
          });
          await wallet.save();
      }

      // Filter transactions
      let filteredTransactions = wallet.transactions;

      if (type) {
          filteredTransactions = filteredTransactions.filter(
              (transaction) => transaction.type === type
          );
      }

      if (q) {
          const lowerCaseQuery = q.toLowerCase();
          filteredTransactions = filteredTransactions.filter(
              (transaction) =>
                  transaction.type.toLowerCase().includes(lowerCaseQuery) ||
                  String(transaction.amount).includes(lowerCaseQuery) ||
                  transaction.date.toISOString().toLowerCase().includes(lowerCaseQuery)
          );
      }

      // Sort by date in descending order (latest first)
      filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Pagination
      const total = filteredTransactions.length;
      const start = (page - 1) * perPage;
      const paginatedTransactions = filteredTransactions.slice(start, start + Number(perPage));

      // Response
      res.status(200).json({
          balance: wallet.balance,
          transactions: paginatedTransactions,
          total,
          page: Number(page),
          perPage: Number(perPage),
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch wallet details
router.get('/details', authenticateToken, async (req, res) => {
  try {
      // Check if the wallet exists for the user
      let wallet = await Wallet.findOne({ userId: req.user.id });

      // If no wallet is found, create a new one with a balance of 0
      if (!wallet) {
          wallet = new Wallet({
              userId: req.user.id,
              balance: 0,
              transactions: [],
          });
          await wallet.save();
      }

      res.status(200).json(wallet);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
