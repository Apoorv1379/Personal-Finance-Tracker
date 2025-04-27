# Personal Finance Tracker

A responsive web application that helps users track their daily, weekly, and monthly expenses. The application allows users to add income and expenses, categorize transactions, and visualize spending patterns through intuitive charts.

![Personal Finance Tracker Screenshot](assets/screenshot.png)

## Features

- **Comprehensive Dashboard**: View daily, weekly, and monthly financial summaries at a glance
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Category Tracking**: Organize transactions by predefined categories
- **Data Visualization**: Interactive charts showing income vs. expenses
- **Date Navigation**: Easily switch between different time periods
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Local Storage**: Data persists between browser sessions
- **Currency Support**: Uses Indian Rupee (₹) by default, easily customizable

## Installation

### Option 1: Direct Download
1. Download the entire project
2. Extract the ZIP file to your preferred location
3. Open `index.html` in your web browser

### Option 2: Clone Repository
```powershell
git clone https://github.com/yourusername/PersonalFinanceTracker.git
cd PersonalFinanceTracker
# Open index.html in your browser
```

## Usage Guide

### Adding Transactions
1. Click the "Add Income" or "Add Expense" button
2. Fill in the required details:
   - Amount
   - Category
   - Date
   - Optional description
3. Click "Save Transaction"

### Viewing Summaries
- The dashboard shows three cards:
  - **Daily Summary**: Income and expenses for the selected day
  - **Weekly Summary**: Financial overview for the week containing the selected day
  - **Monthly Summary**: Financial overview for the month containing the selected day

### Navigating Between Dates
- Use the date picker to select any date
- Use the arrow buttons to move one day at a time
- Click "Today" to quickly return to the current date

### Managing Transactions
- View all transactions in the transactions list
- Filter transactions by type (income/expense) or category
- Edit or delete transactions using the action buttons

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for data visualization
- Font Awesome for icons
- Local Storage API for data persistence

## Customization

### Changing Currency
To change the default currency (₹):
1. Open `app.js` and search for "₹" 
2. Replace all instances with your preferred currency symbol
3. Also update the currency symbol in `charts.js`

### Adding Categories
To add new transaction categories:
1. Edit the `<select id="transactionCategory">` in `index.html`
2. Update the `categoryDisplayMap` in `app.js`

### Modifying the Theme
Edit the CSS variables in the `:root` selector in `styles.css`:
```css
:root {
    --primary-color: #4f46e5;
    --primary-dark: #3730a3;
    /* other color variables */
}
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Future Enhancements

- Export data as CSV/PDF
- Budget setting and alerts
- Multiple currency support
- Recurring transaction support
- Account management (multiple accounts)
- Dark mode

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Chart.js for the visualization library
- Font Awesome for the icons