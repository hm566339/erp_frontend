import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import DataTable from '../../components/tables/DataTable'
import { formatCurrency, formatDate } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function GeneralLedgerPage() {
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState({ totalDebit: 0, totalCredit: 0, balance: 0 })
  const [filters, setFilters] = useState({ account: '', startDate: '', endDate: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const mockEntries = [
      { id: 1, date: '2024-01-15', account: '1000 Cash', debit: 5000, credit: 0, description: 'Initial cash deposit', balance: 5000 },
      { id: 2, date: '2024-01-16', account: '4000 Revenue', debit: 0, credit: 2000, description: 'Invoice #001', balance: 7000 },
      { id: 3, date: '2024-01-17', account: '2000 Payables', debit: 500, credit: 0, description: 'Payment to vendor', balance: 6500 },
    ]
    setEntries(mockEntries)
    setSummary({ totalDebit: 5500, totalCredit: 2000, balance: 3500 })
    setLoading(false)
  }, [])

  const columns = [
    { key: 'date', label: 'Date', render: (val) => formatDate(val), width: '100px' },
    { key: 'account', label: 'Account', width: '200px' },
    { key: 'description', label: 'Description', width: '250px' },
    { key: 'debit', label: 'Debit', render: (val) => formatCurrency(val), width: '100px' },
    { key: 'credit', label: 'Credit', render: (val) => formatCurrency(val), width: '100px' },
    { key: 'balance', label: 'Balance', render: (val) => formatCurrency(val), width: '100px' },
  ]

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">General Ledger</h1>
        <p className="text-muted-foreground mt-1">View and manage all account entries</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Debits</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(summary.totalDebit)}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Credits</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(summary.totalCredit)}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Balance</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(summary.balance)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
        <div className="grid grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Search account..." 
            value={filters.account} 
            onChange={(e) => setFilters({...filters, account: e.target.value})} 
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input 
            type="date" 
            value={filters.startDate} 
            onChange={(e) => setFilters({...filters, startDate: e.target.value})} 
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input 
            type="date" 
            value={filters.endDate} 
            onChange={(e) => setFilters({...filters, endDate: e.target.value})} 
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Account</th>
                  <th className="text-left py-3 px-4 font-medium">Description</th>
                  <th className="text-right py-3 px-4 font-medium">Debit</th>
                  <th className="text-right py-3 px-4 font-medium">Credit</th>
                  <th className="text-right py-3 px-4 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">{formatDate(entry.date)}</td>
                    <td className="py-3 px-4 font-medium">{entry.account}</td>
                    <td className="py-3 px-4">{entry.description}</td>
                    <td className="py-3 px-4 text-right text-accent">{formatCurrency(entry.debit)}</td>
                    <td className="py-3 px-4 text-right text-accent">{formatCurrency(entry.credit)}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(entry.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
