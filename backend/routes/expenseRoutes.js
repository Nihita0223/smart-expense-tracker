const express = require('express');
const { body } = require('express-validator');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getStats,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/', getExpenses);
router.get('/:id', getExpense);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
  ],
  createExpense
);

router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
