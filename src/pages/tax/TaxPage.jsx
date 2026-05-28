import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DataTable from '../../components/tables/DataTable'
import { formatCurrency, formatDate } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function TaxPage() {
  const [taxPeriod, setTaxPeriod] = useState('quarterly')
  
  const gstData = [
    { period: 'Q1', taxable: 45000, tax: 9000, paid: 8500, due: 500 },
    { period: 'Q2', taxable: 52000, tax: 10400, paid: 10400, due: 0 },
    { period: 'Q3', taxable: 48000, tax: 9600, paid: 9000, due: 600 },
    { period: 'Q4', taxable: 61000, tax: 12200, paid: 11000, due: 1200 },
  ]

  const taxReturns = [
    { id: 1, period: '2024-Q1', dueDate: '2024-04-30', status: 'filed', amount: 9000 },
    { id: 2, period: '2024-Q2', dueDate: '2024-07-31', status: 'filed', amount: 10400 },
    { id: 3, period: '2024-Q3', dueDate: '2024-10-31', status: 'pending', amount: 9600 },
  ]

  const columns = [
    { key: 'period', label: 'Tax Period', width: '120px' },
    { key: 'dueDate', label: 'Due Date', render: (val) => formatDate(val), width: '120px' },
    { key: 'amount', label: 'Tax Amount', render: (val) => formatCurrency(val), width: '120px' },
    { key: 'status', label: 'Status', render: (val) => <span className={`px-2 py-1 rounded text-sm ${val === 'filed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{val}</span>, width: '100px' },
  ]

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tax Management</h1>
        <p className="text-muted-foreground mt-1">Track and manage tax obligations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Taxable</p>
          <p className="text-2xl font-bold text-foreground mt-2">{formatCurrency(gstData.reduce((sum, d) => sum + d.taxable, 0))}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Tax</p>
          <p className="text-2xl font-bold text-foreground mt-2">{formatCurrency(gstData.reduce((sum, d) => sum + d.tax, 0))}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Tax Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(gstData.reduce((sum, d) => sum + d.paid, 0))}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Tax Due</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(gstData.reduce((sum, d) => sum + d.due, 0))}</p>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-border">
        <button 
          onClick={() => setTaxPeriod('quarterly')} 
          className={`px-4 py-2 transition-colors ${taxPeriod === 'quarterly' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Quarterly
        </button>
        <button 
          onClick={() => setTaxPeriod('annual')} 
          className={`px-4 py-2 transition-colors ${taxPeriod === 'annual' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Annual
        </button>
      </div>

      {/* GST Chart */}
      {taxPeriod === 'quarterly' && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">GST by Quarter</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gstData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="tax" fill="hsl(var(--primary))" />
              <Bar dataKey="paid" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tax Returns Table */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tax Returns</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Tax Period</th>
                <th className="text-left py-3 px-4 font-medium">Due Date</th>
                <th className="text-right py-3 px-4 font-medium">Tax Amount</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {taxReturns.map((return_item) => (
                <tr key={return_item.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">{return_item.period}</td>
                  <td className="py-3 px-4">{formatDate(return_item.dueDate)}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(return_item.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${return_item.status === 'filed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {return_item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={() => toast.success('Tax return generated')} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Generate Tax Return
        </button>
        <button 
          onClick={() => toast.success('Report exported')} 
          className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Export Report
        </button>
      </div>
    </div>
  )
}
