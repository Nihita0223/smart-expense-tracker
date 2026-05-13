const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get budgets for a month
// @route   GET /api/budgets?month=&year=
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month !== undefined ? Number(req.query.month) : now.getMonth();
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({ user: req.user._id, month, year });

    // Get actual spending for each budget category
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const spending = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
          category: { $in: budgets.map((b) => b.category) },
        },
      },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const spendingMap = {};
    spending.forEach((s) => (spendingMap[s._id] = s.spent));

    const result = budgets.map((b) => ({
      ...b.toObject(),
      spent: spendingMap[b.category] || 0,
      remaining: b.amount - (spendingMap[b.category] || 0),
      percentage: Math.min(((spendingMap[b.category] || 0) / b.amount) * 100, 100),
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a budget
// @route   POST /api/budgets
// @access  Private
const upsertBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Budget saved', data: budget });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
