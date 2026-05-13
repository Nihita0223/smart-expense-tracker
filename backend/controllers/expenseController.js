const { validationResult } = require('express-validator');
const Expense = require('../models/Expense');

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, limit = 50, page = 1, sort = '-date' } = req.query;

    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: expenses,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const expense = await Expense.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, message: 'Expense added', data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense updated', data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const now = new Date();
    const y = Number(year) || now.getFullYear();
    const m = month !== undefined ? Number(month) : now.getMonth();

    const startOfMonth = new Date(y, m, 1);
    const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59);
    const startOfYear = new Date(y, 0, 1);

    // Total this month
    const [monthTotal] = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // By category this month
    const byCategory = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // Monthly trend this year
    const monthlyTrend = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfYear } } },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Recent 5 expenses
    const recent = await Expense.find({ user: req.user._id }).sort('-date').limit(5);

    res.json({
      success: true,
      data: {
        monthTotal: monthTotal?.total || 0,
        byCategory,
        monthlyTrend,
        recent,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExpenses, getExpense, createExpense, updateExpense, deleteExpense, getStats };
