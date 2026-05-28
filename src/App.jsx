import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import DashboardPage from './pages/dashboard/DashboardPage'
import InvoicesPage from './pages/sales/InvoicesPage'
import InvoiceDetailPage from './pages/sales/InvoiceDetailPage'
import VendorsPage from './pages/vendors/VendorsPage'
import VendorDetailPage from './pages/vendors/VendorDetailPage'
import CustomersPage from './pages/customers/CustomersPage'
import CustomerDetailPage from './pages/customers/CustomerDetailPage'
import GeneralLedgerPage from './pages/accounting/GeneralLedgerPage'
import AccountsPayablePage from './pages/accounting/AccountsPayablePage'
import AccountsReceivablePage from './pages/accounting/AccountsReceivablePage'
import ExpensesPage from './pages/expenses/ExpensesPage'
import BudgetPage from './pages/budget/BudgetPage'
import BankReconciliationPage from './pages/banking/BankReconciliationPage'
import TaxPage from './pages/tax/TaxPage'
import ReportsPage from './pages/reports/ReportsPage'
import SettingsPage from './pages/settings/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public App Routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sales/invoices" element={<InvoicesPage />} />
        <Route path="/sales/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/:id" element={<VendorDetailPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/accounting/general-ledger" element={<GeneralLedgerPage />} />
        <Route path="/accounting/accounts-payable" element={<AccountsPayablePage />} />
        <Route path="/accounting/accounts-receivable" element={<AccountsReceivablePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/banking/reconciliation" element={<BankReconciliationPage />} />
        <Route path="/tax" element={<TaxPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <AppRoutes />
        </Router>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
