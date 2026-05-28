import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { fetchInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../store/slices/invoiceSlice'
import { invoiceValidationSchema } from '../../utils/validationSchemas'
import DataTable from '../../components/tables/DataTable'
import FormInput from '../../components/forms/FormInput'
import FormSelect from '../../components/forms/FormSelect'
import { formatCurrency, formatDate } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function InvoicesPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { invoices, loading, error } = useSelector(state => state.invoice)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({ status: 'all', customer: '' })
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(invoiceValidationSchema),
  })

  useEffect(() => {
    dispatch(fetchInvoices({}))
  }, [dispatch])

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await dispatch(updateInvoice({ id: editingId, ...data })).unwrap()
        toast.success('Invoice updated successfully')
      } else {
        await dispatch(createInvoice(data)).unwrap()
        toast.success('Invoice created successfully')
      }
      setIsModalOpen(false)
      setEditingId(null)
      reset()
      dispatch(fetchInvoices({}))
    } catch (err) {
      toast.error(err?.message || 'Failed to save invoice')
    }
  }

  const handleEdit = (invoice) => {
    setEditingId(invoice.id)
    reset(invoice)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await dispatch(deleteInvoice(id)).unwrap()
        toast.success('Invoice deleted successfully')
        dispatch(fetchInvoices({}))
      } catch (err) {
        toast.error('Failed to delete invoice')
      }
    }
  }

  const filteredInvoices = (invoices || []).filter(inv => {
    if (filters.status !== 'all' && inv.status !== filters.status) return false
    if (filters.customer && !inv.customerName?.toLowerCase().includes(filters.customer.toLowerCase())) return false
    return true
  })

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', width: '120px' },
    { key: 'customerName', label: 'Customer', width: '200px' },
    { key: 'invoiceDate', label: 'Date', render: (val) => formatDate(val), width: '120px' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val), width: '120px' },
    { key: 'status', label: 'Status', render: (val) => {
      const statusColor = val === 'PAID' ? 'bg-green-100 text-green-800' : val === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' : val === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      return <span className={`px-2 py-1 rounded text-sm ${statusColor}`}>{val}</span>
    }, width: '100px' },
  ]

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage your sales invoices and payments</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); reset(); setIsModalOpen(true) }} 
          className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          New Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search customer..." 
          onChange={(e) => setFilters({...filters, customer: e.target.value})} 
          className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
        />
        <select 
          value={filters.status} 
          onChange={(e) => setFilters({...filters, status: e.target.value})} 
          className="w-full sm:w-auto px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading && <div className="text-center py-12 text-muted-foreground">Loading...</div>}
      {error && <div className="bg-red-100 text-red-800 text-center py-4 rounded-lg border border-red-200">{error}</div>}
      
      {filteredInvoices.length > 0 ? (
        <div className="overflow-x-auto bg-background border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium">Customer</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-right py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="py-3 px-4 cursor-pointer text-accent hover:underline" onClick={() => navigate(`/sales/invoices/${invoice.id}`)}>
                    {invoice.invoiceNumber}
                  </td>
                  <td className="py-3 px-4">{invoice.customerName}</td>
                  <td className="py-3 px-4">{formatDate(invoice.invoiceDate)}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(invoice.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : invoice.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' : invoice.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/sales/invoices/${invoice.id}`)}
                      className="text-accent hover:underline text-xs mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="text-destructive hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No invoices found</div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-foreground">{editingId ? 'Edit Invoice' : 'New Invoice'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput label="Invoice Number" {...register('invoiceNumber')} error={errors.invoiceNumber?.message} />
              <FormInput label="Customer" {...register('customerName')} error={errors.customerName?.message} />
              <FormInput label="Amount" type="number" {...register('totalAmount')} error={errors.totalAmount?.message} />
              <FormSelect label="Status" {...register('status')} options={[{label: 'Draft', value: 'draft'}, {label: 'Sent', value: 'sent'}, {label: 'Paid', value: 'paid'}]} error={errors.status?.message} />
              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-input rounded-lg hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
