const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  category: {
    type: String,
    enum: ['food', 'transportation', 'housing', 'utilities', 'entertainment', 'healthcare', 'other'],
    required: function() {
      return this.type === 'expense';
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Middleware to update user totals when a transaction is created
transactionSchema.post('save', async function() {
  const User = mongoose.model('User');
  const user = await User.findById(this.userId);
  if (user) {
    await user.updateTotals(this.amount, this.type);
  }
});

// Middleware to update user totals when a transaction is deleted
transactionSchema.post('remove', async function() {
  const User = mongoose.model('User');
  const user = await User.findById(this.userId);
  if (user) {
    // Subtract the amount since we're removing the transaction
    await user.updateTotals(-this.amount, this.type);
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 