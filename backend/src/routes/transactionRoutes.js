const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

// Validation middleware
const validateTransaction = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['income', 'expense']).withMessage('Invalid transaction type'),
  body('category')
    .if(body('type').equals('expense'))
    .isIn(['food', 'transportation', 'housing', 'utilities', 'entertainment', 'healthcare', 'other'])
    .withMessage('Invalid category for expense'),
];

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction
router.post('/', validateTransaction, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const transaction = new Transaction(req.body);
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update transaction
router.put('/:id', validateTransaction, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Store old values for updating user totals
    const oldAmount = transaction.amount;
    const oldType = transaction.type;

    Object.assign(transaction, req.body);
    const updatedTransaction = await transaction.save();

    // Update user totals based on the difference
    if (oldAmount !== updatedTransaction.amount || oldType !== updatedTransaction.type) {
      const User = require('../models/User');
      const user = await User.findById(updatedTransaction.userId);
      if (user) {
        // Remove old transaction effect
        await user.updateTotals(-oldAmount, oldType);
        // Add new transaction effect
        await user.updateTotals(updatedTransaction.amount, updatedTransaction.type);
      }
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.remove();
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 