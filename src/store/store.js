import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import invoiceReducer from './slices/invoiceSlice'
import vendorReducer from './slices/vendorSlice'
import customerReducer from './slices/customerSlice'
import accountsPayableReducer from './slices/accountsPayableSlice'
import accountsReceivableReducer from './slices/accountsReceivableSlice'
import budgetReducer from './slices/budgetSlice'
import expenseReducer from './slices/expenseSlice'
import generalLedgerReducer from './slices/generalLedgerSlice'
import taxReducer from './slices/taxSlice'
import bankReconciliationReducer from './slices/bankReconciliationSlice'
import reportsReducer from './slices/reportsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    invoice: invoiceReducer,
    vendor: vendorReducer,
    customer: customerReducer,
    accountsPayable: accountsPayableReducer,
    accountsReceivable: accountsReceivableReducer,
    budget: budgetReducer,
    expense: expenseReducer,
    generalLedger: generalLedgerReducer,
    tax: taxReducer,
    bankReconciliation: bankReconciliationReducer,
    reports: reportsReducer,
  },
})
