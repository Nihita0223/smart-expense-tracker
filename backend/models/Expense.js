const mongoose = require('mongoose');

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Education',
  'Travel',
  'Utilities',
  'Other',
];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'],
      default: 'Other',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
