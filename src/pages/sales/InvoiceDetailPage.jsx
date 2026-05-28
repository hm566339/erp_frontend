import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getInvoiceDetail, updateInvoice, deleteInvoice, rejectInvoice, postInvoice } from '../../store/slices/invoiceSlice'
import { formatCurrency, formatDate } from '../../utils/utils'
import { Toaster, toast } from 'sonner'
import { ChevronLeft, Download, Trash2 } from 'lucide-react'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { detail: invoice, loading, error } = useSelector(state => state.invoice)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    dispatch(getInvoiceDetail(id))
  }, [id, dispatch])

  useEffect(() => {
    if (invoice) {
      setEditData(invoice)
    }
  }, [invoice])

  const handleStatusChange = async (action) => {
    try {
      if (action === 'reject') {
        await dispatch(rejectInvoice(id)).unwrap()
        toast.success('Invoice rejected')
      } else if (action === 'post') {
        await dispatch(postInvoice(id)).unwrap()
        toast.success('Invoice posted to GL')
      }
      dispatch(getInvoiceDetail(id))
    } catch (err) {
      toast.error(err?.message || 'Action failed')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await dispatch(deleteInvoice(id)).unwrap()
        toast.success('Invoice deleted')
        navigate('/sales/invoices')
      } catch (err) {
        toast.error(err?.message || 'Failed to delete invoice')
      }
    }
  }

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateInvoice({ id, ...editData })).unwrap()
      toast.success('Invoice updated')
      setIsEditing(false)
      dispatch(getInvoiceDetail(id))
    } catch (err) {
      toast.error(err?.message || 'Failed to update invoice')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        {error || 'Invoice not found'}
      </div>
    )
  }

  const statusColor = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    POSTED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-600 text-white',
    REJECTED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/sales/invoices')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">{formatDate(invoice.invoiceDate)}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColor[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
          {invoice.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {invoice.status === 'DRAFT' && (
          <>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={() => handleStatusChange('reject')}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Reject
            </button>
          </>
        )}
        {invoice.status === 'PENDING_APPROVAL' && (
          <button
            onClick={() => handleStatusChange('post')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Post to GL
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Download size={16} />
          Print
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Invoice Details */}
          <div className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Invoice Details</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Invoice Number</label>
                  <input
                    type="text"
                    value={editData?.invoiceNumber || ''}
                    onChange={(e) => setEditData({ ...editData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Customer</label>
                  <input
                    type="text"
                    value={editData?.customerName || ''}
                    onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <input
                      type="number"
                      value={editData?.amount || 0}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={editData?.invoiceDate || ''}
                      onChange={(e) => setEditData({ ...editData, invoiceDate: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveEdit}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Invoice Number</p>
                  <p className="font-medium">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{invoice.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Invoice Date</p>
                  <p className="font-medium">{formatDate(invoice.invoiceDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{formatDate(invoice.dueDate) || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          {invoice.lineItems && invoice.lineItems.length > 0 && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Line Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-4">Description</th>
                      <th className="text-right py-2 px-4">Qty</th>
                      <th className="text-right py-2 px-4">Unit Price</th>
                      <th className="text-right py-2 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="text-right py-3 px-4">{item.quantity}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(item.unitPrice)}</td>
                        <td className="text-right py-3 px-4 font-medium">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="bg-background border border-border rounded-lg p-6 h-fit space-y-4">
          <h3 className="font-semibold text-lg">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal || invoice.amount || 0)}</span>
            </div>
            {invoice.taxAmount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            {invoice.discountAmount && (
              <div className="flex justify-between text-green-600">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium">-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-border flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatCurrency(invoice.amount || 0)}</span>
            </div>
            {invoice.paidAmount && (
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-medium text-green-600">{formatCurrency(invoice.paidAmount)}</span>
              </div>
            )}
            {invoice.amount && invoice.paidAmount && invoice.amount > invoice.paidAmount && (
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="font-medium text-orange-600">{formatCurrency(invoice.amount - invoice.paidAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
