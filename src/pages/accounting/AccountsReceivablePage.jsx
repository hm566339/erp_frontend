import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DataTable from '../../components/tables/DataTable'
import { formatCurrency, formatDate } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function AccountsReceivablePage() {
  const [invoices] = useState([
    { id: 1, invoiceNumber: 'INV-001', customer: 'Customer A', amount: 1500, dueDate: '2024-02-15', status: 'paid', invoiceDate: '2024-01-15' },
    { id: 2, invoiceNumber: 'INV-002', customer: 'Customer B', amount: 2500, dueDate: '2024-02-20', status: 'pending', invoiceDate: '2024-01-20' },
    { id: 3, invoiceNumber: 'INV-003', customer: 'Customer C', amount: 800, dueDate: '2024-02-25', status: 'overdue', invoiceDate: '2024-01-25' },
  ])

  const agingData = [
    { days: 'Current', amount: 3000 },
    { days: '30 Days', amount: 1500 },
    { days: '60+ Days', amount: 800 },
  ]

  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0)

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', width: '100px' },
    { key: 'customer', label: 'Customer', width: '150px' },
    { key: 'invoiceDate', label: 'Invoice Date', render: (val) => formatDate(val), width: '100px' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val), width: '100px' },
    { key: 'dueDate', label: 'Due Date', render: (val) => formatDate(val), width: '100px' },
    { key: 'status', label: 'Status', render: (val) => <span className={`px-2 py-1 rounded text-sm ${val === 'paid' ? 'bg-green-100 text-green-800' : val === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{val}</span>, width: '100px' },
  ]

  const handleCollectPayment = (id) => {
    toast.success('Payment received')
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Accounts Receivable</h1>
        <p className="text-muted-foreground mt-1">Track customer invoices and payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Invoices</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(invoices.reduce((sum, i) => sum + i.amount, 0))}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Outstanding</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Overdue Invoices</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{invoices.filter(i => i.status === 'overdue').length}</p>
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

      {/* Outstanding Invoices Table */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium">Customer</th>
                <th className="text-left py-3 px-4 font-medium">Invoice Date</th>
                <th className="text-right py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Due Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-center py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.filter(i => i.status !== 'paid').map((invoice) => (
                <tr key={invoice.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                  <td className="py-3 px-4">{invoice.customer}</td>
                  <td className="py-3 px-4">{formatDate(invoice.invoiceDate)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(invoice.amount)}</td>
                  <td className="py-3 px-4">{formatDate(invoice.dueDate)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleCollectPayment(invoice.id)} className="text-accent hover:underline text-xs">Collect</button>
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
