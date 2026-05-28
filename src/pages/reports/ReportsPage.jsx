import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('pl')

  const plData = [
    { month: 'Jan', revenue: 45000, expenses: 28000, profit: 17000 },
    { month: 'Feb', revenue: 52000, expenses: 31000, profit: 21000 },
    { month: 'Mar', revenue: 48000, expenses: 29000, profit: 19000 },
    { month: 'Apr', revenue: 61000, expenses: 35000, profit: 26000 },
  ]

  const balanceSheetData = [
    { name: 'Assets', value: 150000 },
    { name: 'Liabilities', value: 60000 },
    { name: 'Equity', value: 90000 },
  ]

  const colors = ['#3b82f6', '#ef4444', '#10b981']

  const exportReport = (format) => {
    toast.success(`Report exported as ${format.toUpperCase()}`)
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">View and export comprehensive financial statements</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportReport('pdf')} 
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Export PDF
          </button>
          <button 
            onClick={() => exportReport('excel')} 
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-border">
        <button 
          onClick={() => setReportType('pl')} 
          className={`px-4 py-2 transition-colors ${reportType === 'pl' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          P&L Statement
        </button>
        <button 
          onClick={() => setReportType('bs')} 
          className={`px-4 py-2 transition-colors ${reportType === 'bs' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Balance Sheet
        </button>
        <button 
          onClick={() => setReportType('cf')} 
          className={`px-4 py-2 transition-colors ${reportType === 'cf' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Cash Flow
        </button>
      </div>

      {/* P&L Statement */}
      {reportType === 'pl' && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Profit & Loss Statement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" />
              <Bar dataKey="profit" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Balance Sheet */}
      {reportType === 'bs' && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Balance Sheet</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={balanceSheetData} cx="50%" cy="50%" labelLine={false} label={({name, value}) => `${name}: ${formatCurrency(value)}`} outerRadius={100} fill="#8884d8" dataKey="value">
                {balanceSheetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cash Flow Statement */}
      {reportType === 'cf' && (
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cash Flow Statement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={plData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
