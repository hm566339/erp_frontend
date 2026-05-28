import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DataTable from '../../components/tables/DataTable'
import { formatCurrency } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function BudgetPage() {
  const [activeBudget, setActiveBudget] = useState('2024')
  
  const budgetData = [
    { department: 'Sales', budgeted: 50000, actual: 45000, variance: 5000 },
    { department: 'Marketing', budgeted: 30000, actual: 32000, variance: -2000 },
    { department: 'Operations', budgeted: 40000, actual: 38000, variance: 2000 },
    { department: 'IT', budgeted: 25000, actual: 24500, variance: 500 },
  ]

  const monthlyData = [
    { month: 'Jan', budget: 40000, actual: 38000 },
    { month: 'Feb', budget: 42000, actual: 41000 },
    { month: 'Mar', budget: 41000, actual: 43000 },
    { month: 'Apr', budget: 40000, actual: 39000 },
  ]

  const columns = [
    { key: 'department', label: 'Department', width: '150px' },
    { key: 'budgeted', label: 'Budgeted', render: (val) => formatCurrency(val), width: '120px' },
    { key: 'actual', label: 'Actual', render: (val) => formatCurrency(val), width: '120px' },
    { key: 'variance', label: 'Variance', render: (val) => <span className={val >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(val)}</span>, width: '120px' },
  ]

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and track budget performance</p>
      </div>

      {/* Year Selector */}
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveBudget('2024')} 
          className={`px-4 py-2 rounded-lg transition-colors ${activeBudget === '2024' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
        >
          2024
        </button>
        <button 
          onClick={() => setActiveBudget('2025')} 
          className={`px-4 py-2 rounded-lg transition-colors ${activeBudget === '2025' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
        >
          2025
        </button>
      </div>

      {/* Budget by Department Chart */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Budget by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="budgeted" fill="hsl(var(--primary))" />
            <Bar dataKey="actual" fill="hsl(var(--accent))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Budget Trend Chart */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Budget Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="budget" stroke="hsl(var(--primary))" strokeWidth={2} />
            <Line type="monotone" dataKey="actual" stroke="hsl(var(--accent))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Details Table */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Budget Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Department</th>
                <th className="text-right py-3 px-4 font-medium">Budgeted</th>
                <th className="text-right py-3 px-4 font-medium">Actual</th>
                <th className="text-right py-3 px-4 font-medium">Variance</th>
              </tr>
            </thead>
            <tbody>
              {budgetData.map((item, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{item.department}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(item.budgeted)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(item.actual)}</td>
                  <td className={`py-3 px-4 text-right font-medium ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(item.variance)}
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
