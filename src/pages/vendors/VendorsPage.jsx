import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { fetchVendors, createVendor, updateVendor, deleteVendor } from '../../store/slices/vendorSlice'
import { vendorValidationSchema } from '../../utils/validationSchemas'
import DataTable from '../../components/tables/DataTable'
import FormInput from '../../components/forms/FormInput'
import { formatCurrency } from '../../utils/utils'
import { Toaster, toast } from 'sonner'

export default function VendorsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { vendors, loading } = useSelector(state => state.vendor)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(vendorValidationSchema),
  })

  useEffect(() => {
    dispatch(fetchVendors({}))
  }, [dispatch])

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await dispatch(updateVendor({ id: editingId, ...data })).unwrap()
        toast.success('Vendor updated')
      } else {
        await dispatch(createVendor(data)).unwrap()
        toast.success('Vendor created')
      }
      setIsModalOpen(false)
      setEditingId(null)
      reset()
      dispatch(fetchVendors({}))
    } catch (err) {
      toast.error(err?.message || 'Failed to save vendor')
    }
  }

  const handleEdit = (vendor) => {
    setEditingId(vendor.id)
    reset(vendor)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await dispatch(deleteVendor(id)).unwrap()
        toast.success('Vendor deleted')
        dispatch(fetchVendors({}))
      } catch (err) {
        toast.error(err?.message || 'Failed to delete vendor')
      }
    }
  }

  const filteredVendors = (vendors || []).filter(v => 
    v.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    { key: 'vendorName', label: 'Vendor Name', width: '200px' },
    { key: 'email', label: 'Email', width: '200px' },
    { key: 'phone', label: 'Phone', width: '150px' },
    { key: 'city', label: 'City', width: '150px' },
    { key: 'totalSpent', label: 'Total Spent', render: (val) => formatCurrency(val), width: '120px' },
    { key: 'status', label: 'Status', render: (val) => <span className={`px-2 py-1 rounded text-sm ${val === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{val}</span>, width: '100px' },
  ]

  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <button onClick={() => { setEditingId(null); reset(); setIsModalOpen(true) }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Vendor</button>
      </div>

      <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border rounded" />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="overflow-x-auto bg-background border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Vendor Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Phone</th>
                <th className="text-left py-3 px-4 font-medium">City</th>
                <th className="text-right py-3 px-4 font-medium">Total Spent</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="py-3 px-4 cursor-pointer text-accent hover:underline font-medium" onClick={() => navigate(`/vendors/${vendor.id}`)}>
                    {vendor.vendorName}
                  </td>
                  <td className="py-3 px-4 text-sm">{vendor.email}</td>
                  <td className="py-3 px-4 text-sm">{vendor.phone || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm">{vendor.city || 'N/A'}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(vendor.totalSpent || 0)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {vendor.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/vendors/${vendor.id}`)}
                      className="text-accent hover:underline text-xs mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
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
        <div className="text-center py-12 text-muted-foreground">No vendors found</div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Vendor' : 'New Vendor'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput label="Vendor Name" {...register('vendorName')} error={errors.vendorName?.message} />
              <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />
              <FormInput label="Phone" {...register('phone')} error={errors.phone?.message} />
              <FormInput label="City" {...register('city')} error={errors.city?.message} />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
