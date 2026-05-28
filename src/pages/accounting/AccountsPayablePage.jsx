import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DataTable from '../../components/tables/DataTable'
import { formatCurrency, formatDate } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function AccountsPayablePage() {
  const [bills] = useState([
    { id: 1, billNumber: 'BILL-001', vendor: 'Supplier A', amount: 1500, dueDate: '2024-02-15', status: 'paid', invoiceDate: '2024-01-15' },
    { id: 2, billNumber: 'BILL-002', vendor: 'Supplier B', amount: 2500, dueDate: '2024-02-20', status: 'pending', invoiceDate: '2024-01-20' },
    { id: 3, billNumber: 'BILL-003', vendor: 'Supplier C', amount: 800, dueDate: '2024-02-25', status: 'overdue', invoiceDate: '2024-01-25' },
  ])

  const agingData = [
    { days: 'Current', amount: 3000 },
    { days: '30 Days', amount: 1500 },
    { days: '60+ Days', amount: 800 },
  ]

  const totalOutstanding = bills.filter(b => b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0)

  const columns = [
    { key: 'billNumber', label: 'Bill #', width: '100px' },
    { key: 'vendor', label: 'Vendor', width: '150px' },
    { key: 'invoiceDate', label: 'Invoice Date', render: (val) => formatDate(val), width: '100px' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val), width: '100px' },
    { key: 'dueDate', label: 'Due Date', render: (val) => formatDate(val), width: '100px' },
    { key: 'status', label: 'Status', render: (val) => <span className={`px-2 py-1 rounded text-sm ${val === 'paid' ? 'bg-green-100 text-green-800' : val === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{val}</span>, width: '100px' },
  ]

  const handlePayBill = (id) => {
    toast.success('Bill payment processed')
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Accounts Payable</h1>
        <p className="text-muted-foreground mt-1">Manage supplier bills and payment obligations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Bills</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(bills.reduce((sum, b) => sum + b.amount, 0))}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Outstanding</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Overdue Bills</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{bills.filter(b => b.status === 'overdue').length}</p>
        </div>
      </div>

      {/* Aging Analysis Chart */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Aging Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="days" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="amount" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Outstanding Bills Table */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Bills</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Bill #</th>
                <th className="text-left py-3 px-4 font-medium">Vendor</th>
                <th className="text-left py-3 px-4 font-medium">Invoice Date</th>
                <th className="text-right py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Due Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-center py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.filter(b => b.status !== 'paid').map((bill) => (
                <tr key={bill.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{bill.billNumber}</td>
                  <td className="py-3 px-4">{bill.vendor}</td>
                  <td className="py-3 px-4">{formatDate(bill.invoiceDate)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(bill.amount)}</td>
                  <td className="py-3 px-4">{formatDate(bill.dueDate)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : bill.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handlePayBill(bill.id)} className="text-accent hover:underline text-xs">Pay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
