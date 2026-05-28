import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomerDetail, updateCustomer, deleteCustomer } from '../../store/slices/customerSlice'
import { formatCurrency } from '../../utils/utils'
import { Toaster, toast } from 'sonner'
import { ChevronLeft, Trash2, CheckCircle, XCircle } from 'lucide-react'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { detail: customer, loading, error } = useSelector(state => state.customer)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    dispatch(getCustomerDetail(id))
  }, [id, dispatch])

  useEffect(() => {
    if (customer) {
      setEditData(customer)
    }
  }, [customer])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await dispatch(deleteCustomer(id)).unwrap()
        toast.success('Customer deleted')
        navigate('/customers')
      } catch (err) {
        toast.error(err?.message || 'Failed to delete customer')
      }
    }
  }

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateCustomer({ id, ...editData })).unwrap()
      toast.success('Customer updated')
      setIsEditing(false)
      dispatch(getCustomerDetail(id))
    } catch (err) {
      toast.error(err?.message || 'Failed to update customer')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        {error || 'Customer not found'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{customer.customerName}</h1>
            <p className="text-muted-foreground">Customer ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {customer.isActive ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <CheckCircle size={20} />
              Active
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
              <XCircle size={20} />
              Inactive
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Customer Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Customer Name</label>
                  <input
                    type="text"
                    value={editData?.customerName || ''}
                    onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={editData?.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      value={editData?.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <input
                      type="text"
                      value={editData?.city || ''}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <input
                      type="text"
                      value={editData?.state || ''}
                      onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <textarea
                    value={editData?.address || ''}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg mt-1"
                    rows="3"
                  />
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
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">City</p>
                  <p className="font-medium">{customer.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">State</p>
                  <p className="font-medium">{customer.state || 'N/A'}</p>
                </div>
                {customer.address && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="bg-background border border-border rounded-lg p-6 h-fit space-y-4">
          <h3 className="font-semibold text-lg">Customer Stats</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Orders</span>
              <span className="font-medium">{customer.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Revenue</span>
              <span className="font-medium">{formatCurrency(customer.totalRevenue || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Outstanding Balance</span>
              <span className="font-medium text-orange-600">{formatCurrency(customer.outstandingBalance || 0)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${customer.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {customer.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credit Limit</span>
              <span className="font-medium">{formatCurrency(customer.creditLimit || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
