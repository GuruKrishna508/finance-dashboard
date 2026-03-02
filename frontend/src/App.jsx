import React, { useState, useEffect } from 'react';

const API_URL = 'https://finance-dashboard-73ck.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    category: 'Food & Dining',
    amount: '',
    type: 'expense',
    merchant: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: 0,
    deadline: ''
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Health & Fitness',
    'Housing',
    'Utilities',
    'Income',
    'Other'
  ];

  // Fetch all data
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
    fetchSavingsGoals();
    fetchInsights();
    fetchPredictions();
    fetchAnalytics();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/budgets`);
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    }
  };

  const fetchSavingsGoals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/savings-goals`);
      const data = await res.json();
      setSavingsGoals(data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch(`${API_URL}/api/insights`);
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error('Error fetching insights:', err);
    }
  };

  const fetchPredictions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/predictions`);
      const data = await res.json();
      setPredictions(data);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/analytics`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount) * (newTransaction.type === 'expense' ? -1 : 1)
        })
      });
      
      if (res.ok) {
        setNewTransaction({
          description: '',
          category: 'Food & Dining',
          amount: '',
          type: 'expense',
          merchant: '',
          date: new Date().toISOString().split('T')[0]
        });
        setShowAddTransaction(false);
        fetchTransactions();
        fetchBudgets();
        fetchInsights();
        fetchPredictions();
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await fetch(`${API_URL}/api/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
      fetchBudgets();
      fetchInsights();
      fetchAnalytics();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/savings-goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGoal,
          target: parseFloat(newGoal.target)
        })
      });
      
      if (res.ok) {
        setNewGoal({ name: '', target: '', current: 0, deadline: '' });
        setShowAddGoal(false);
        fetchSavingsGoals();
      }
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const handleUpdateGoal = async (id, newAmount) => {
    try {
      await fetch(`${API_URL}/api/savings-goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current: parseFloat(newAmount) })
      });
      fetchSavingsGoals();
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  // Overview Tab Component
  const OverviewTab = () => (
    <div style={styles.tabContent} className="fade-in">
      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <div style={styles.statLabel}>Total Income</div>
            <div style={styles.statValue}>
              ${analytics?.totalIncome.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#fee2e2'}}>💸</div>
          <div>
            <div style={styles.statLabel}>Total Expenses</div>
            <div style={styles.statValue}>
              ${analytics?.totalExpenses.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#d1fae5'}}>📈</div>
          <div>
            <div style={styles.statLabel}>Net Savings</div>
            <div style={{...styles.statValue, color: analytics?.netSavings >= 0 ? '#10b981' : '#ef4444'}}>
              ${analytics?.netSavings.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#fef3c7'}}>🎯</div>
          <div>
            <div style={styles.statLabel}>Savings Goals</div>
            <div style={styles.statValue}>
              {savingsGoals.length} Active
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🤖 AI-Powered Insights</h2>
        <div style={styles.insightsGrid}>
          {insights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                ...styles.insightCard,
                borderLeft: `4px solid ${
                  insight.type === 'alert' ? '#ef4444' :
                  insight.type === 'warning' ? '#f59e0b' :
                  insight.type === 'success' ? '#10b981' : '#3b82f6'
                }`
              }}
            >
              <div style={styles.insightHeader}>
                <span style={styles.insightType}>
                  {insight.type === 'alert' ? '🚨' :
                   insight.type === 'warning' ? '⚠️' :
                   insight.type === 'success' ? '✅' : '💡'}
                  {' '}{insight.category}
                </span>
                <span style={{
                  ...styles.priorityBadge,
                  background: insight.priority === 'high' ? '#fee2e2' :
                             insight.priority === 'medium' ? '#fef3c7' : '#dbeafe',
                  color: insight.priority === 'high' ? '#991b1b' :
                         insight.priority === 'medium' ? '#92400e' : '#1e40af'
                }}>
                  {insight.priority}
                </span>
              </div>
              <p style={styles.insightMessage}>{insight.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      {predictions && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📊 Spending Predictions</h2>
          <div style={styles.predictionsCard}>
            <div style={styles.predictionItem}>
              <span style={styles.predictionLabel}>Daily Average</span>
              <span style={styles.predictionValue}>${predictions.daily}</span>
            </div>
            <div style={styles.predictionItem}>
              <span style={styles.predictionLabel}>Projected Monthly</span>
              <span style={styles.predictionValue}>${predictions.monthly}</span>
            </div>
            <div style={styles.predictionItem}>
              <span style={styles.predictionLabel}>Projected Annual</span>
              <span style={styles.predictionValue}>${predictions.annual}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Transactions Tab Component
  const TransactionsTab = () => (
    <div style={styles.tabContent} className="fade-in">
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Recent Transactions</h2>
        <button onClick={() => setShowAddTransaction(true)} style={styles.addButton}>
          + Add Transaction
        </button>
      </div>
      
      <div style={styles.transactionsList}>
        {transactions.map(transaction => (
          <div key={transaction.id} style={styles.transactionCard}>
            <div style={styles.transactionIcon}>
              {transaction.type === 'income' ? '💵' : '💳'}
            </div>
            <div style={styles.transactionInfo}>
              <div style={styles.transactionTitle}>{transaction.description}</div>
              <div style={styles.transactionMeta}>
                {transaction.merchant} • {transaction.category} • {transaction.date}
              </div>
            </div>
            <div style={styles.transactionRight}>
              <div style={{
                ...styles.transactionAmount,
                color: transaction.type === 'income' ? '#10b981' : '#ef4444'
              }}>
                {transaction.type === 'income' ? '+' : '-'}
                ${Math.abs(transaction.amount).toFixed(2)}
              </div>
              <button
                onClick={() => handleDeleteTransaction(transaction.id)}
                style={styles.deleteBtn}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Budgets Tab Component
  const BudgetsTab = () => (
    <div style={styles.tabContent} className="fade-in">
      <h2 style={styles.sectionTitle}>Budget Overview</h2>
      <div style={styles.budgetsGrid}>
        {budgets.map(budget => {
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          
          return (
            <div key={budget.category} style={styles.budgetCard}>
              <div style={styles.budgetHeader}>
                <span style={styles.budgetCategory}>{budget.category}</span>
                <span style={styles.budgetAmount}>
                  ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                </span>
              </div>
              
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${Math.min(percentage, 100)}%`,
                  background: percentage > 90 ? '#ef4444' :
                             percentage > 70 ? '#f59e0b' : '#10b981'
                }} />
              </div>
              
              <div style={styles.budgetFooter}>
                <span style={styles.budgetPercentage}>{percentage.toFixed(0)}% used</span>
                <span style={{
                  ...styles.budgetRemaining,
                  color: remaining < 0 ? '#ef4444' : '#6b7280'
                }}>
                  ${remaining.toFixed(2)} {remaining >= 0 ? 'left' : 'over'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Savings Goals Tab Component
  const SavingsTab = () => (
    <div style={styles.tabContent} className="fade-in">
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Savings Goals</h2>
        <button onClick={() => setShowAddGoal(true)} style={styles.addButton}>
          + Add Goal
        </button>
      </div>
      
      <div style={styles.goalsGrid}>
        {savingsGoals.map(goal => {
          const percentage = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={goal.id} style={styles.goalCard}>
              <h3 style={styles.goalName}>{goal.name}</h3>
              
              <div style={styles.goalProgress}>
                <div style={styles.goalAmount}>
                  ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                </div>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${Math.min(percentage, 100)}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                  }} />
                </div>
                <div style={styles.goalPercentage}>{percentage.toFixed(0)}% Complete</div>
              </div>
              
              <div style={styles.goalFooter}>
                <div style={styles.goalDeadline}>
                  📅 {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                </div>
                <div style={styles.goalRemaining}>
                  ${remaining.toFixed(2)} to go
                </div>
              </div>
              
              <input
                type="number"
                placeholder="Add amount"
                style={styles.goalInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleUpdateGoal(goal.id, parseFloat(goal.current) + parseFloat(e.target.value));
                    e.target.value = '';
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>💎 AI Finance Dashboard</h1>
          <p style={styles.subtitle}>Smart money management powered by artificial intelligence</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.nav}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'transactions', label: '💳 Transactions', icon: '💳' },
          { id: 'budgets', label: '📈 Budgets', icon: '📈' },
          { id: 'savings', label: '🎯 Savings Goals', icon: '🎯' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.navButton,
              ...(activeTab === tab.id ? styles.navButtonActive : {})
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <main style={styles.main}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'budgets' && <BudgetsTab />}
        {activeTab === 'savings' && <SavingsTab />}
      </main>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div style={styles.modal} onClick={() => setShowAddTransaction(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Add Transaction</h2>
            <form onSubmit={handleAddTransaction} style={styles.form}>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                style={styles.input}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                style={styles.input}
                required
              />
              
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                style={styles.input}
                required
              />
              
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                style={styles.input}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Merchant"
                value={newTransaction.merchant}
                onChange={(e) => setNewTransaction({...newTransaction, merchant: e.target.value})}
                style={styles.input}
              />
              
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                style={styles.input}
              />
              
              <div style={styles.modalButtons}>
                <button type="button" onClick={() => setShowAddTransaction(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div style={styles.modal} onClick={() => setShowAddGoal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Create Savings Goal</h2>
            <form onSubmit={handleAddGoal} style={styles.form}>
              <input
                type="text"
                placeholder="Goal name (e.g., New Car)"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                style={styles.input}
                required
              />
              
              <input
                type="number"
                step="0.01"
                placeholder="Target amount"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                style={styles.input}
                required
              />
              
              <input
                type="date"
                placeholder="Deadline"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                style={styles.input}
                required
              />
              
              <div style={styles.modalButtons}>
                <button type="button" onClick={() => setShowAddGoal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  nav: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '12px',
    borderRadius: '12px',
  },
  navButton: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'transparent',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  navButtonActive: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  main: {
    minHeight: '600px',
  },
  tabContent: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    background: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
  },
  section: {
    marginBottom: '30px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  insightsGrid: {
    display: 'grid',
    gap: '16px',
  },
  insightCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  insightType: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  priorityBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  insightMessage: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
  },
  predictionsCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  predictionItem: {
    textAlign: 'center',
  },
  predictionLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
  },
  predictionValue: {
    display: 'block',
    fontSize: '32px',
    fontWeight: '700',
    color: '#3b82f6',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  transactionCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  transactionIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  transactionMeta: {
    fontSize: '13px',
    color: '#64748b',
  },
  transactionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  transactionAmount: {
    fontSize: '18px',
    fontWeight: '700',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    opacity: 0.5,
    transition: 'opacity 0.2s',
  },
  budgetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  budgetCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  budgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  budgetCategory: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  budgetAmount: {
    fontSize: '14px',
    color: '#64748b',
  },
  progressBar: {
    height: '10px',
    background: '#f1f5f9',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  budgetFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  budgetPercentage: {
    color: '#64748b',
  },
  budgetRemaining: {
    fontWeight: '600',
  },
  goalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  goalCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  goalName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
  },
  goalProgress: {
    marginBottom: '16px',
  },
  goalAmount: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
  },
  goalPercentage: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '8px',
  },
  goalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px',
  },
  goalDeadline: {
    fontSize: '13px',
    color: '#64748b',
  },
  goalRemaining: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#3b82f6',
  },
  goalInput: {
    width: '100%',
    padding: '10px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 24px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
export default App;