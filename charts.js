// Chart configuration and utility functions
class FinanceCharts {
    constructor() {
      this.charts = {
        daily: null,
        weekly: null,
        monthly: null
      };
      this.chartColors = {
        income: 'rgba(16, 185, 129, 0.7)',
        expense: 'rgba(239, 68, 68, 0.7)',
        incomeBackground: 'rgba(16, 185, 129, 0.2)',
        expenseBackground: 'rgba(239, 68, 68, 0.2)'
      };
    }
  
    // Initialize all charts
    initCharts() {
      this.initDailyChart();
      this.initWeeklyChart();
      this.initMonthlyChart();
    }
  
    // Initialize daily chart
    initDailyChart() {
      const ctx = document.getElementById('dailyChart').getContext('2d');
      this.charts.daily = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Income', 'Expense'],
          datasets: [{
            label: 'Amount (₹)',
            data: [0, 0],
            backgroundColor: [
              this.chartColors.income,
              this.chartColors.expense
            ],
            borderColor: [
              this.chartColors.income,
              this.chartColors.expense
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '₹' + value
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => '₹' + context.raw
              }
            }
          }
        }
      });
    }
  
    // Initialize weekly chart
    initWeeklyChart() {
      const ctx = document.getElementById('weeklyChart').getContext('2d');
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      this.charts.weekly = new Chart(ctx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Income',
              data: Array(7).fill(0),
              borderColor: this.chartColors.income,
              backgroundColor: this.chartColors.incomeBackground,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Expense',
              data: Array(7).fill(0),
              borderColor: this.chartColors.expense,
              backgroundColor: this.chartColors.expenseBackground,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '₹' + value
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: (context) => context.dataset.label + ': ₹' + context.raw
              }
            }
          }
        }
      });
    }
  
    // Initialize monthly chart
    initMonthlyChart() {
      const ctx = document.getElementById('monthlyChart').getContext('2d');
      
      this.charts.monthly = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [
            {
              label: 'Income',
              data: Array(5).fill(0),
              backgroundColor: this.chartColors.income
            },
            {
              label: 'Expense',
              data: Array(5).fill(0),
              backgroundColor: this.chartColors.expense
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              stacked: false,
              ticks: {
                callback: (value) => '₹' + value
              }
            },
            x: {
              stacked: false
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: (context) => context.dataset.label + ': ₹' + context.raw
              }
            }
          }
        }
      });
    }
  
    // Update daily chart with new data
    updateDailyChart(income, expense) {
      if (this.charts.daily) {
        this.charts.daily.data.datasets[0].data = [income, expense];
        this.charts.daily.update();
      }
    }
  
    // Update weekly chart with new data
    updateWeeklyChart(incomeData, expenseData) {
      if (this.charts.weekly) {
        this.charts.weekly.data.datasets[0].data = incomeData;
        this.charts.weekly.data.datasets[1].data = expenseData;
        this.charts.weekly.update();
      }
    }
  
    // Update monthly chart with new data
    updateMonthlyChart(incomeData, expenseData) {
      if (this.charts.monthly) {
        this.charts.monthly.data.datasets[0].data = incomeData;
        this.charts.monthly.data.datasets[1].data = expenseData;
        this.charts.monthly.update();
      }
    }
  
    // Update all summary displays
    updateSummaryDisplays(dailyData, weeklyData, monthlyData) {
      // Update daily summary
      document.querySelector('.daily .income-value').textContent = `₹${dailyData.income.toFixed(2)}`;
      document.querySelector('.daily .expense-value').textContent = `₹${dailyData.expense.toFixed(2)}`;
      document.querySelector('.daily .balance-value').textContent = `₹${(dailyData.income - dailyData.expense).toFixed(2)}`;
      
      // Update weekly summary
      const weeklyIncome = weeklyData.income.reduce((sum, val) => sum + val, 0);
      const weeklyExpense = weeklyData.expense.reduce((sum, val) => sum + val, 0);
      document.querySelector('.weekly .income-value').textContent = `₹${weeklyIncome.toFixed(2)}`;
      document.querySelector('.weekly .expense-value').textContent = `₹${weeklyExpense.toFixed(2)}`;
      document.querySelector('.weekly .balance-value').textContent = `₹${(weeklyIncome - weeklyExpense).toFixed(2)}`;
      
      // Update monthly summary
      const monthlyIncome = monthlyData.income.reduce((sum, val) => sum + val, 0);
      const monthlyExpense = monthlyData.expense.reduce((sum, val) => sum + val, 0);
      document.querySelector('.monthly .income-value').textContent = `₹${monthlyIncome.toFixed(2)}`;
      document.querySelector('.monthly .expense-value').textContent = `₹${monthlyExpense.toFixed(2)}`;
      document.querySelector('.monthly .balance-value').textContent = `₹${(monthlyIncome - monthlyExpense).toFixed(2)}`;
    }
  }