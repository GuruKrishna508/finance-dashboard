import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// Mock data storage
let transactions = [
  {
    id: '1',
    date: '2024-02-05',
    description: 'Salary Deposit',
    category: 'Income',
    amount: 5000,
    type: 'income',
    merchant: 'Company Inc.'
  },
  {
    id: '2',
    date: '2024-02-04',
    description: 'Grocery Shopping',
    category: 'Food & Dining',
    amount: -125.50,
    type: 'expense',
    merchant: 'Whole Foods'
  },
  {
    id: '3',
    date: '2024-02-03',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    amount: -15.99,
    type: 'expense',
    merchant: 'Netflix'
  },
  {
    id: '4',
    date: '2024-02-02',
    description: 'Gym Membership',
    category: 'Health & Fitness',
    amount: -50,
    type: 'expense',
    merchant: 'Planet Fitness'
  },
  {
    id: '5',
    date: '2024-02-01',
    description: 'Rent Payment',
    category: 'Housing',
    amount: -1500,
    type: 'expense',
    merchant: 'Property Management'
  },
  {
    id: '6',
    date: '2024-01-30',
    description: 'Gas Station',
    category: 'Transportation',
    amount: -45.20,
    type: 'expense',
    merchant: 'Shell'
  },
  {
    id: '7',
    date: '2024-01-28',
    description: 'Coffee Shop',
    category: 'Food & Dining',
    amount: -12.50,
    type: 'expense',
    merchant: 'Starbucks'
  },
  {
    id: '8',
    date: '2024-01-25',
    description: 'Freelance Project',
    category: 'Income',
    amount: 800,
    type: 'income',
    merchant: 'Client XYZ'
  }
];

let budgets = [
  { category: 'Food & Dining', limit: 400, spent: 138 },
  { category: 'Transportation', limit: 200, spent: 45.20 },
  { category: 'Entertainment', limit: 100, spent: 15.99 },
  { category: 'Shopping', limit: 300, spent: 0 },
  { category: 'Health & Fitness', limit: 150, spent: 50 }
];

let savingsGoals = [
  { id: '1', name: 'Emergency Fund', target: 10000, current: 3500, deadline: '2024-12-31' },
  { id: '2', name: 'Vacation to Europe', target: 5000, current: 1200, deadline: '2024-08-01' },
  { id: '3', name: 'New Laptop', target: 2000, current: 850, deadline: '2024-06-01' }
];

// AI-powered insights generation
function generateInsights(transactions, budgets) {
  const insights = [];
  
  // Spending pattern analysis
  const recentExpenses = transactions
    .filter(t => t.type === 'expense')
    .slice(0, 5)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  if (recentExpenses > 500) {
    insights.push({
      type: 'warning',
      category: 'Spending',
      message: `You've spent $${recentExpenses.toFixed(2)} in recent transactions. Consider reviewing your expenses.`,
      priority: 'high'
    });
  }

  // Budget analysis
  budgets.forEach(budget => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage > 90) {
      insights.push({
        type: 'alert',
        category: budget.category,
        message: `You're at ${percentage.toFixed(0)}% of your ${budget.category} budget. Only $${(budget.limit - budget.spent).toFixed(2)} remaining.`,
        priority: 'high'
      });
    } else if (percentage > 70) {
      insights.push({
        type: 'warning',
        category: budget.category,
        message: `${budget.category} budget is ${percentage.toFixed(0)}% used. Watch your spending.`,
        priority: 'medium'
      });
    }
  });

  // Category-specific insights
  const foodExpenses = transactions.filter(t => 
    t.category === 'Food & Dining' && t.type === 'expense'
  );
  
  if (foodExpenses.length > 3) {
    const avgMeal = foodExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0) / foodExpenses.length;
    insights.push({
      type: 'tip',
      category: 'Food & Dining',
      message: `Your average meal cost is $${avgMeal.toFixed(2)}. Cooking at home could save you 40% monthly.`,
      priority: 'low'
    });
  }

  // Positive insights
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const savingsRate = ((income - expenses) / income) * 100;

  if (savingsRate > 20) {
    insights.push({
      type: 'success',
      category: 'Savings',
      message: `Excellent! You're saving ${savingsRate.toFixed(0)}% of your income. Keep up the great work!`,
      priority: 'medium'
    });
  }

  return insights;
}

// Predict future spending using simple linear regression
function predictSpending(transactions) {
  const last30Days = transactions.filter(t => {
    const date = new Date(t.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo && t.type === 'expense';
  });

  const dailyExpenses = {};
  last30Days.forEach(t => {
    const date = t.date;
    dailyExpenses[date] = (dailyExpenses[date] || 0) + Math.abs(t.amount);
  });

  const avgDailySpending = Object.values(dailyExpenses).reduce((a, b) => a + b, 0) / 30;
  const projectedMonthly = avgDailySpending * 30;

  return {
    daily: avgDailySpending.toFixed(2),
    monthly: projectedMonthly.toFixed(2),
    annual: (projectedMonthly * 12).toFixed(2)
  };
}

// API Routes

// Get all transactions
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// Add transaction
app.post('/api/transactions', (req, res) => {
  const newTransaction = {
    id: uuidv4(),
    ...req.body,
    date: req.body.date || new Date().toISOString().split('T')[0]
  };
  transactions.unshift(newTransaction);

  // Update budget if applicable
  if (newTransaction.type === 'expense') {
    const budget = budgets.find(b => b.category === newTransaction.category);
    if (budget) {
      budget.spent += Math.abs(newTransaction.amount);
    }
  }

  res.status(201).json(newTransaction);
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  const index = transactions.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    const transaction = transactions[index];
    
    // Update budget if applicable
    if (transaction.type === 'expense') {
      const budget = budgets.find(b => b.category === transaction.category);
      if (budget) {
        budget.spent -= Math.abs(transaction.amount);
      }
    }
    
    transactions.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// Get budgets
app.get('/api/budgets', (req, res) => {
  res.json(budgets);
});

// Update budget
app.put('/api/budgets/:category', (req, res) => {
  const budget = budgets.find(b => b.category === req.params.category);
  if (budget) {
    budget.limit = req.body.limit;
    res.json(budget);
  } else {
    res.status(404).json({ error: 'Budget not found' });
  }
});

// Get savings goals
app.get('/api/savings-goals', (req, res) => {
  res.json(savingsGoals);
});

// Add savings goal
app.post('/api/savings-goals', (req, res) => {
  const newGoal = {
    id: uuidv4(),
    ...req.body
  };
  savingsGoals.push(newGoal);
  res.status(201).json(newGoal);
});

// Update savings goal progress
app.put('/api/savings-goals/:id', (req, res) => {
  const goal = savingsGoals.find(g => g.id === req.params.id);
  if (goal) {
    goal.current = req.body.current;
    res.json(goal);
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

// Get AI insights
app.get('/api/insights', (req, res) => {
  const insights = generateInsights(transactions, budgets);
  res.json(insights);
});

// Get spending predictions
app.get('/api/predictions', (req, res) => {
  const predictions = predictSpending(transactions);
  res.json(predictions);
});

// Get analytics
app.get('/api/analytics', (req, res) => {
  const categoryTotals = {};
  const monthlyData = {};

  transactions.forEach(t => {
    // Category breakdown
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = { income: 0, expense: 0 };
    }
    
    if (t.type === 'income') {
      categoryTotals[t.category].income += t.amount;
    } else {
      categoryTotals[t.category].expense += Math.abs(t.amount);
    }

    // Monthly trends
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += Math.abs(t.amount);
    }
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));

  res.json({
    categoryTotals,
    monthlyData,
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Finance Dashboard API running on http://localhost:${PORT}`);
});
