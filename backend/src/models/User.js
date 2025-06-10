const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Virtual for calculating balance
userSchema.virtual('balance').get(function() {
  return this.totalIncome - this.totalExpense;
});

// Method to update totals
userSchema.methods.updateTotals = async function(amount, type) {
  if (type === 'income') {
    this.totalIncome += amount;
  } else {
    this.totalExpense += amount;
  }
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User; 