// Main application functionality
class FinanceTracker {
    constructor() {
      this.transactions = JSON.parse(localStorage.getItem('financeTransactions')) || [];
      this.charts = new FinanceCharts();
      this.currentDate = new Date();
      this.selectedDate = new Date();
      
      // DOM elements
      this.elements = {
        dateSelector: document.getElementById('dateSelector'),
        todayBtn: document.getElementById('todayBtn'),
        prevDateBtn: document.getElementById('prevDate'),
        nextDateBtn: document.getElementById('nextDate'),
        addExpenseBtn: document.getElementById('addExpenseBtn'),
        addIncomeBtn: document.getElementById('addIncomeBtn'),
        transactionModal: document.getElementById('transactionModal'),
        closeModalBtn: document.querySelector('.close-btn'),
        transactionForm: document.getElementById('transactionForm'),
        transactionType: document.getElementById('transactionType'),
        transactionDate: document.getElementById('transactionDate'),
        modalTitle: document.getElementById('modalTitle'),
        transactionsList: document.getElementById('transactionsList'),
        transactionFilter: document.getElementById('transactionFilter'),
        categoryFilter: document.getElementById('categoryFilter')
      };
      
      this.initApp();
    }
    
    // Initialize application
    initApp() {
      this.setDatePickerToday();
      this.setupEventListeners();
      this.updateCategoryFilter();
      this.charts.initCharts();
      this.updateDashboard();
      this.renderTransactions();
    }
    
    // Set date picker to today
    setDatePickerToday() {
      const formattedDate = this.formatDateForInput(this.selectedDate);
      this.elements.dateSelector.value = formattedDate;
    }
    
    // Set up event listeners
    setupEventListeners() {
      // Date navigation
      this.elements.dateSelector.addEventListener('change', () => {
        this.selectedDate = new Date(this.elements.dateSelector.value);
        this.updateDashboard();
        this.renderTransactions();
      });
      
      this.elements.todayBtn.addEventListener('click', () => {
        this.selectedDate = new Date();
        this.setDatePickerToday();
        this.updateDashboard();
        this.renderTransactions();
      });
      
      this.elements.prevDateBtn.addEventListener('click', () => {
        this.selectedDate.setDate(this.selectedDate.getDate() - 1);
        this.elements.dateSelector.value = this.formatDateForInput(this.selectedDate);
        this.updateDashboard();
        this.renderTransactions();
      });
      
      this.elements.nextDateBtn.addEventListener('click', () => {
        this.selectedDate.setDate(this.selectedDate.getDate() + 1);
        this.elements.dateSelector.value = this.formatDateForInput(this.selectedDate);
        this.updateDashboard();
        this.renderTransactions();
      });
      
      // Transaction buttons
      this.elements.addExpenseBtn.addEventListener('click', () => {
        this.openTransactionModal('expense');
      });
      
      this.elements.addIncomeBtn.addEventListener('click', () => {
        this.openTransactionModal('income');
      });
      
      // Modal close button
      this.elements.closeModalBtn.addEventListener('click', () => {
        this.closeTransactionModal();
      });
      
      // Form submission
      this.elements.transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveTransaction();
      });
      
      // Filter changes
      this.elements.transactionFilter.addEventListener('change', () => {
        this.renderTransactions();
      });
      
      this.elements.categoryFilter.addEventListener('change', () => {
        this.renderTransactions();
      });
      
      // Close modal when clicking outside
      window.addEventListener('click', (e) => {
        if (e.target === this.elements.transactionModal) {
          this.closeTransactionModal();
        }
      });
    }
    
    // Format date for input field (YYYY-MM-DD)
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // Open transaction modal
    openTransactionModal(type) {
      this.elements.modalTitle.textContent = type === 'expense' ? 'Add Expense' : 'Add Income';
      this.elements.transactionType.value = type;
      this.elements.transactionDate.value = this.formatDateForInput(this.selectedDate);
      this.elements.transactionModal.style.display = 'block';
    }
    
    // Close transaction modal
    closeTransactionModal() {
      this.elements.transactionModal.style.display = 'none';
      this.elements.transactionForm.reset();
    }
    
    // Save new transaction
    saveTransaction() {
      const form = this.elements.transactionForm;
      const type = document.getElementById('transactionType').value;
      const amount = parseFloat(document.getElementById('transactionAmount').value);
      const category = document.getElementById('transactionCategory').value;
      const date = document.getElementById('transactionDate').value;
      const description = document.getElementById('transactionDescription').value || '';
      
      const newTransaction = {
        id: Date.now(),
        type,
        amount,
        category,
        date,
        description
      };
      
      this.transactions.push(newTransaction);
      this.saveToLocalStorage();
      this.closeTransactionModal();
      this.updateDashboard();
      this.renderTransactions();
      this.updateCategoryFilter();
    }
    
    // Save transactions to local storage
    saveToLocalStorage() {
      localStorage.setItem('financeTransactions', JSON.stringify(this.transactions));
    }
    
// Update the dashboard with current data
updateDashboard() {
    const dailyData = this.calculateDailyData();
    const weeklyData = this.calculateWeeklyData();
    const monthlyData = this.calculateMonthlyData();
    
    // Update charts
    this.charts.updateDailyChart(dailyData.income, dailyData.expense);
    this.charts.updateWeeklyChart(weeklyData.income, weeklyData.expense);
    this.charts.updateMonthlyChart(monthlyData.income, monthlyData.expense);
    
    // Update summary displays
    this.charts.updateSummaryDisplays(dailyData, weeklyData, monthlyData);
  }
  
  // Calculate data for daily chart
  calculateDailyData() {
    const selectedDateStr = this.formatDateForInput(this.selectedDate);
    const dailyTransactions = this.transactions.filter(
      transaction => transaction.date === selectedDateStr
    );
    
    const income = dailyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = dailyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expense };
  }
  
  // Calculate data for weekly chart
  calculateWeeklyData() {
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(this.selectedDate);
    startOfWeek.setDate(this.selectedDate.getDate() - this.selectedDate.getDay());
    
    const incomeData = Array(7).fill(0);
    const expenseData = Array(7).fill(0);
    
    // Loop through each day of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const currentDateStr = this.formatDateForInput(currentDate);
      
      // Filter transactions for this day
      const dayTransactions = this.transactions.filter(
        transaction => transaction.date === currentDateStr
      );
      
      // Calculate income and expense
      incomeData[i] = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      expenseData[i] = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    }
    
    return { income: incomeData, expense: expenseData };
  }
  
  // Calculate data for monthly chart
  calculateMonthlyData() {
    // Get the first day of the month
    const firstDayOfMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
    
    // Number of weeks (always use 5 for consistency in the chart)
    const numWeeks = 5;
    const incomeData = Array(numWeeks).fill(0);
    const expenseData = Array(numWeeks).fill(0);
    
    // Process all transactions for the month
    const monthTransactions = this.transactions.filter(transaction => {
      const transDate = new Date(transaction.date);
      return (
        transDate.getFullYear() === this.selectedDate.getFullYear() &&
        transDate.getMonth() === this.selectedDate.getMonth()
      );
    });
    
    // Assign each transaction to a week
    monthTransactions.forEach(transaction => {
      const transDate = new Date(transaction.date);
      // Calculate which week of the month (0-indexed)
      const weekOfMonth = Math.floor((transDate.getDate() - 1) / 7);
      
      if (transaction.type === 'income') {
        incomeData[weekOfMonth] += transaction.amount;
      } else {
        expenseData[weekOfMonth] += transaction.amount;
      }
    });
    
    return { income: incomeData, expense: expenseData };
  }
  
  // Render transactions list
  renderTransactions() {
    const transactionsList = this.elements.transactionsList;
    const transactionFilter = this.elements.transactionFilter.value;
    const categoryFilter = this.elements.categoryFilter.value;
    
    // Clear the current list
    transactionsList.innerHTML = '';
    
    // Get transactions for selected date month
    let filteredTransactions = this.transactions.filter(transaction => {
      const transDate = new Date(transaction.date);
      return (
        transDate.getFullYear() === this.selectedDate.getFullYear() &&
        transDate.getMonth() === this.selectedDate.getMonth()
      );
    });
    
    // Apply type filter
    if (transactionFilter !== 'all') {
      filteredTransactions = filteredTransactions.filter(
        t => t.type === transactionFilter
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredTransactions = filteredTransactions.filter(
        t => t.category === categoryFilter
      );
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredTransactions.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No transactions to display';
      transactionsList.appendChild(emptyState);
      return;
    }
    
    // Create and append transaction items
    filteredTransactions.forEach(transaction => {
      const transactionItem = document.createElement('div');
      transactionItem.className = `transaction-item ${transaction.type}`;
      
      const formattedDate = new Date(transaction.date).toLocaleDateString();
      const categoryDisplayMap = {
        'food': 'Food & Dining',
        'transportation': 'Transportation',
        'utilities': 'Utilities',
        'entertainment': 'Entertainment',
        'shopping': 'Shopping',
        'health': 'Health',
        'education': 'Education',
        'salary': 'Salary',
        'investment': 'Investment',
        'other': 'Other'
      };
      
      transactionItem.innerHTML = `
        <div class="transaction-info">
          <div class="transaction-description">
            ${transaction.description || categoryDisplayMap[transaction.category]}
          </div>
          <div class="transaction-category">
            ${categoryDisplayMap[transaction.category]} • ${formattedDate}
          </div>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${transaction.type === 'expense' ? '-' : '+'}₹${transaction.amount.toFixed(2)}
        </div>
        <div class="transaction-actions">
          <button class="edit-btn" data-id="${transaction.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" data-id="${transaction.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      // Add event listeners for edit and delete
      const editBtn = transactionItem.querySelector('.edit-btn');
      const deleteBtn = transactionItem.querySelector('.delete-btn');
      
      editBtn.addEventListener('click', () => {
        this.editTransaction(transaction.id);
      });
      
      deleteBtn.addEventListener('click', () => {
        this.deleteTransaction(transaction.id);
      });
      
      transactionsList.appendChild(transactionItem);
    });
  }
  
  // Update category filter options
  updateCategoryFilter() {
    const categoryFilter = this.elements.categoryFilter;
    const categories = this.getAllCategories();
    
    // Save current selection
    const currentSelection = categoryFilter.value;
    
    // Clear options except first one ('All Categories')
    while (categoryFilter.options.length > 1) {
      categoryFilter.remove(1);
    }
    
    // Add new options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.value;
      option.textContent = category.label;
      categoryFilter.appendChild(option);
    });
    
    // Restore selection if possible
    if (currentSelection !== 'all') {
      categoryFilter.value = currentSelection;
      // If not found, will default to 'all'
    }
  }
  
  // Get all categories for the filter
  getAllCategories() {
    const categoryMap = {
      'food': 'Food & Dining',
      'transportation': 'Transportation',
      'utilities': 'Utilities',
      'entertainment': 'Entertainment',
      'shopping': 'Shopping',
      'health': 'Health',
      'education': 'Education',
      'salary': 'Salary',
      'investment': 'Investment',
      'other': 'Other'
    };
    
    // Return all predefined categories
    return Object.entries(categoryMap).map(([value, label]) => ({ value, label }));
  }
  
  // Edit an existing transaction
  editTransaction(id) {
    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) return;
    
    // Populate the form
    this.elements.modalTitle.textContent = transaction.type === 'expense' ? 'Edit Expense' : 'Edit Income';
    document.getElementById('transactionType').value = transaction.type;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionCategory').value = transaction.category;
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionDescription').value = transaction.description || '';
    
    // Add a hidden input for the transaction ID
    let idInput = document.getElementById('transactionId');
    if (!idInput) {
      idInput = document.createElement('input');
      idInput.type = 'hidden';
      idInput.id = 'transactionId';
      this.elements.transactionForm.appendChild(idInput);
    }
    idInput.value = id;
    
    // Show the modal
    this.elements.transactionModal.style.display = 'block';
    
    // Update the form submit handler
    const formSubmitHandler = this.elements.transactionForm.onsubmit;
    this.elements.transactionForm.onsubmit = (e) => {
      e.preventDefault();
      this.updateTransaction();
    };
  }
  
  // Update an existing transaction
  updateTransaction() {
    const id = parseInt(document.getElementById('transactionId').value);
    const index = this.transactions.findIndex(t => t.id === id);
    
    if (index === -1) return;
    
    // Update the transaction
    this.transactions[index] = {
      id,
      type: document.getElementById('transactionType').value,
      amount: parseFloat(document.getElementById('transactionAmount').value),
      category: document.getElementById('transactionCategory').value,
      date: document.getElementById('transactionDate').value,
      description: document.getElementById('transactionDescription').value || ''
    };
    
    // Save and update UI
    this.saveToLocalStorage();
    this.closeTransactionModal();
    this.updateDashboard();
    this.renderTransactions();
    
    // Reset form submit handler
    this.elements.transactionForm.onsubmit = (e) => {
      e.preventDefault();
      this.saveTransaction();
    };
  }
  
  // Delete a transaction
  deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.saveToLocalStorage();
      this.updateDashboard();
      this.renderTransactions();
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new FinanceTracker();
});