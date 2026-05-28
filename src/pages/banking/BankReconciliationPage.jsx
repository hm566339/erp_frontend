import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import { formatCurrency, formatDate } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function BankReconciliationPage() {
  const [reconciliation, setReconciliation] = useState({
    bankBalance: 45000,
    bookBalance: 42500,
    uncleared: [
      { id: 1, date: '2024-01-25', description: 'Check #1001', amount: 2500, cleared: false },
      { id: 2, date: '2024-01-26', description: 'Check #1002', amount: 500, cleared: false },
    ],
    deposits: [
      { id: 1, date: '2024-01-20', description: 'Deposit', amount: 5000, cleared: true },
      { id: 2, date: '2024-01-21', description: 'Deposit', amount: 3000, cleared: true },
    ],
  })

  const handleClearItem = (id) => {
    setReconciliation({
      ...reconciliation,
      uncleared: reconciliation.uncleared.map(item =>
        item.id === id ? { ...item, cleared: !item.cleared } : item
      ),
    })
    toast.success('Item cleared')
  }

  const checkColumns = [
    { key: 'date', label: 'Date', render: (val) => formatDate(val), width: '100px' },
    { key: 'description', label: 'Description', width: '200px' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val), width: '120px' },
    {
      key: 'cleared',
      label: 'Cleared',
      render: (val) => (
        <input type="checkbox" checked={val} readOnly className="cursor-pointer" />
      ),
      width: '80px',
    },
  ]

  const depositColumns = [
    { key: 'date', label: 'Date', render: (val) => formatDate(val), width: '100px' },
    { key: 'description', label: 'Description', width: '200px' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val), width: '120px' },
    { key: 'cleared', label: 'Status', render: (val) => <span className="text-green-600">{val ? 'Cleared' : 'Pending'}</span>, width: '80px' },
  ]

  const unclearedChecks = reconciliation.uncleared.filter(c => !c.cleared)
  const totalUncleared = unclearedChecks.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bank Reconciliation</h1>
        <p className="text-muted-foreground mt-1">Reconcile bank and book balances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Bank Balance</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(reconciliation.bankBalance)}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Book Balance</p>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(reconciliation.bookBalance)}</p>
        </div>
        <div className="bg-background border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Difference</p>
          <p className={`text-3xl font-bold mt-2 ${reconciliation.bankBalance === reconciliation.bookBalance ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(reconciliation.bankBalance - reconciliation.bookBalance)}
          </p>
        </div>
      </div>

      {/* Outstanding Checks */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Checks ({unclearedChecks.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
                <th className="text-right py-3 px-4 font-medium">Amount</th>
                <th className="text-center py-3 px-4 font-medium">Cleared</th>
              </tr>
            </thead>
            <tbody>
              {unclearedChecks.map((check) => (
                <tr key={check.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">{formatDate(check.date)}</td>
                  <td className="py-3 px-4">{check.description}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(check.amount)}</td>
                  <td className="py-3 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={check.cleared} 
                      onChange={() => handleClearItem(check.id)}
                      className="cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right text-lg font-semibold text-foreground">
          Total Uncleared: {formatCurrency(totalUncleared)}
        </div>
      </div>

      {/* Deposits */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Deposits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
                <th className="text-right py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {reconciliation.deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">{formatDate(deposit.date)}</td>
                  <td className="py-3 px-4">{deposit.description}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(deposit.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${deposit.cleared ? 'text-green-600' : 'text-orange-600'}`}>
                      {deposit.cleared ? 'Cleared' : 'Pending'}
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
          onClick={() => toast.success('Reconciliation saved')} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Save Reconciliation
        </button>
        <button 
          onClick={() => toast.success('Report generated')} 
          className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Generate Report
        </button>
      </div>
    </div>
  )
}
