# Expense Tracker Application

A modern, feature-rich expense tracking application built with React (TypeScript) and C# .NET backend. Track your income, expenses, and savings with beautiful analytics and reporting features.

## Features

### 💰 Core Functionality

- **Add Expenses/Income**: Create new expense or income entries with detailed information
- **Edit & Delete**: Modify or remove entries with ease
- **Multiple Expense Types**: Support for Expense, Income, and Saving types (extensible)
- **Categorization**: Organize expenses by predefined or custom categories
- **Date Tracking**: Track transactions with precise dates

### 📊 Analytics & Dashboard

- **Monthly Summary**: View month-by-month financial overview
- **Category Breakdown**: Analyze spending by category with visual charts
- **Total Calculations**: Quick view of total income, expenses, savings, and net balance
- **Comprehensive Analytics**: Detailed analytics with period selection

### 🔍 Filtering & Search

- **Filter by Type**: Show only Income, Expense, or Saving entries
- **Filter by Period**: View All time, Daily, Weekly, Monthly, or Yearly data
- **Filter by Name**: Search by expense/income name
- **Real-time Filtering**: Results update instantly as you adjust filters

### 📥 Export Features

- **Excel Export**: Export filtered data to Excel spreadsheet
- **Multiple Export Options**:
    - Current filtered data
    - Specific month and year
    - Full year data
- **Formatted Excel**: Color-coded rows with summary totals

### 🎨 Theme Support

- **Light Mode**: Clean white interface
- **Dark Mode**: Easy on the eyes for night usage
- **Rose Mode**: Beautiful rose color scheme for a modern look
- **Persistent Theme**: Your theme choice is saved locally
- **Smooth Transitions**: Beautiful animations when switching themes

### ✨ User Experience

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean UI**: Modern, intuitive interface with beautiful cards and layouts
- **Loading States**: Visual feedback during data operations
- **Error Handling**: Friendly error messages for failed operations
- **Form Validation**: Clear validation messages for form inputs

## Technology Stack

### Frontend

- **React 19** with TypeScript
- **Reactstrap**: Bootstrap components for React
- **Axios**: HTTP client for API communication
- **XLSX**: Excel file generation
- **CSS3**: Custom styling with CSS variables for theme support

### Backend

- **C# .NET 9.0**
- **ASP.NET Core Web API**
- **In-memory data storage** (can be replaced with database)
- **CORS enabled** for frontend communication
- **Comprehensive API documentation**

## Project Structure

```
├── UI/
│   └── src/
│       └── app/
│           └── ExpenseTracker/
│               ├── expenses/
│               │   ├── components/
│               │   │   ├── ExpensesDashboard.tsx       # Analytics dashboard
│               │   │   ├── ExpensesDashboard.css
│               │   │   ├── ExpensesList.tsx            # Expenses table with filters
│               │   │   ├── ExpensesList.css
│               │   │   ├── ExpensesForm.tsx            # Add/Edit form
│               │   │   ├── ExpensesForm.css
│               │   │   └── ExpensesNavbar.tsx          # Navigation with theme
│               │   ├── pages/
│               │   │   ├── ExpensesHome.tsx           # Main page
│               │   │   └── ExpensesHome.css
│               │   ├── utils/
│               │   │   ├── CONSTANT.ts                # Constants and enums
│               │   │   └── expensesService.ts         # API service layer
│               │   └── Modal/
│               │       └── Modals.ts                  # TypeScript types
│               └── utils/
│                   └── CONSTANT.ts                    # App-wide constants
│
└── BackendApp/
    ├── Controllers/
    │   └── ExpensesController.cs                     # API endpoints
    ├── Models/
    │   ├── Expense.cs                               # Main expense entity
    │   ├── ExpenseType.cs                           # Expense type entity
    │   └── ExpenseAnalytics.cs                      # Analytics models
    ├── Services/
    │   └── ExpenseService.cs                        # Business logic
    └── Program.cs                                   # App configuration
```

## API Endpoints

### Get All Expenses

```
GET /api/expenses
```

### Get Expense by ID

```
GET /api/expenses/{id}
```

### Create Expense

```
POST /api/expenses
Body: {
  "type": "Expense",
  "amount": 100.00,
  "name": "Groceries",
  "description": "Weekly shopping",
  "notes": "Fresh produce",
  "category": "Food",
  "date": "2024-01-31",
  "taskId": 0
}
```

### Update Expense

```
PUT /api/expenses/{id}
Body: { ...expense data... }
```

### Delete Expense

```
DELETE /api/expenses/{id}
```

### Filter by Type

```
GET /api/expenses/by-type/{type}
```

### Filter by Category

```
GET /api/expenses/by-category/{category}
```

### Get by Date Range

```
GET /api/expenses/date-range?startDate=2024-01-01&endDate=2024-01-31
```

### Get All Expense Names

```
GET /api/expenses/names/all
```

### Get Analytics Summary

```
GET /api/expenses/analytics/summary?startDate=2024-01-01&endDate=2024-01-31
```

### Get Monthly Summary

```
GET /api/expenses/analytics/monthly/{year}
```

### Get Category Breakdown

```
GET /api/expenses/analytics/categories?startDate=2024-01-01&endDate=2024-01-31
```

## Getting Started

### Frontend Setup

1. Navigate to the UI folder:

```bash
cd UI
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default port)

### Backend Setup

1. Navigate to BackendApp folder:

```bash
cd BackendApp
```

2. Build the project:

```bash
dotnet build
```

3. Run the project:

```bash
dotnet run
```

The API will be available at `https://localhost:7270`

## Configuration

### API Base URL

Update the API base URL in [UI/src/app/ExpenseTracker/utils/CONSTANT.ts](UI/src/app/ExpenseTracker/utils/CONSTANT.ts):

```typescript
export const API_BASE_URL = "https://localhost:7270/api";
```

### Theme Colors

Customize theme colors in [UI/src/index.css](UI/src/index.css):

```css
:root {
    --primary: #f43f5e; /* Rose color */
    --primary-hover: #e11d48;
    /* ... more colors ... */
}
```

## Usage Guide

### Adding an Expense

1. Click "Add Expense" button in the header
2. Fill in the form:
    - **Type**: Select Expense, Income, or Saving
    - **Amount**: Enter the amount
    - **Name**: Select from common names or enter new
    - **Category**: Select from predefined categories
    - **Date**: Pick the transaction date
    - **Description**: Optional description
    - **Notes**: Optional additional notes
3. Click "Create Expense"

### Filtering Expenses

1. Use the filter section at the top of the list:
    - **Type Filter**: Show specific expense types
    - **Period Filter**: Filter by time range (Daily, Weekly, Monthly, Yearly)
    - **Name Filter**: Filter by expense name
2. Filters apply in real-time

### Viewing Analytics

1. Click "Dashboard & Analytics" tab
2. View:
    - Summary cards (Total Income, Expense, Saving, Balance)
    - Monthly summary for selected year
    - Category breakdown with percentages

### Exporting Data

1. Click "Export to Excel" button
2. Choose export type:
    - Current Filtered Data: Export what's currently shown
    - Specific Month: Select month and year
    - Specific Year: Select year only
3. Click "Export" - file downloads automatically

### Changing Theme

1. Click theme dropdown in navbar
2. Select:
    - ☀️ Light: White background theme
    - 🌙 Dark: Dark background theme
    - 🌹 Rose: Rose color theme
3. Theme preference is saved automatically

## Data Models

### Expense

```csharp
public class Expense
{
    public int Id { get; set; }
    public string Type { get; set; }              // "Expense", "Income", "Saving"
    public decimal Amount { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? Notes { get; set; }
    public string? Category { get; set; }
    public DateTime Date { get; set; }
    public int TaskId { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
}
```

### ExpenseAnalytics

```csharp
public class ExpenseAnalytics
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal TotalSaving { get; set; }
    public decimal NetBalance { get; set; }
    public int TotalTransactions { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public Dictionary<string, decimal> ByType { get; set; }
    public Dictionary<string, decimal> ByCategory { get; set; }
    public Dictionary<string, decimal> ByMonth { get; set; }
}
```

## Code Quality

This project follows best practices for maintainability:

### Frontend

- **TypeScript**: Strong typing throughout
- **Component-based**: Reusable React components
- **Service Layer**: Separation of API calls from components
- **Custom Hooks**: Reusable state logic
- **CSS Variables**: Centralized theme colors
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive error management
- **Form Validation**: Client-side validation

### Backend

- **Clean Architecture**: Separation of concerns
- **Service Pattern**: Business logic in services
- **Async Operations**: Non-blocking API calls
- **Logging**: Built-in logging for debugging
- **CORS**: Proper cross-origin configuration
- **HTTP Status Codes**: Appropriate response codes
- **Documentation**: XML comments for public methods

## Future Enhancements

- Database integration (SQL Server, PostgreSQL)
- User authentication & authorization
- Multi-user support
- Recurring transactions
- Budget planning features
- Advanced charts and visualizations
- Mobile app (React Native)
- CSV import functionality
- Cloud sync & backup
- Expense notifications
- Spending goals

## Troubleshooting

### Frontend Issues

- **CORS Errors**: Ensure backend is running and CORS is configured
- **API Not Found**: Check if backend URL is correct in CONSTANT.ts
- **Theme Not Persisting**: Clear browser local storage
- **Styling Issues**: Check if CSS files are imported correctly

### Backend Issues

- **Port Already in Use**: Change port in launchSettings.json
- **Database Connection**: Update connection string if using database
- **CORS Problems**: Verify CORS policy in Program.cs

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:

1. Check existing issues
2. Review code comments and documentation
3. Test with sample data
4. Check browser console for errors
5. Verify API responses in network tab

## Best Practices

### For Users

- Regular backups: Export your data periodically
- Consistent naming: Use consistent names for recurring items
- Category usage: Use categories effectively for better analysis
- Date accuracy: Ensure dates are correct for accurate analytics

### For Developers

- Follow TypeScript strict mode
- Use React hooks over class components
- Implement proper error boundaries
- Test API responses
- Keep components small and focused
- Use constants for magic strings
- Comment complex logic
- Run linter before committing

## Performance Considerations

- Expenses are filtered client-side for snappy UI
- API calls are async with proper loading states
- CSS uses GPU-accelerated transitions
- Form validation is instant with no debounce
- Excel export happens client-side (no server load)
- Theme switching is instantaneous

Enjoy tracking your expenses with this beautiful modern application! 💰
