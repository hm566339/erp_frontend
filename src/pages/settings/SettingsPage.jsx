import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FormInput from '../../components/forms/FormInput'
import FormSelect from '../../components/forms/FormSelect'
import { Toaster, toast } from 'sonner'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      companyName: 'ABC Corporation',
      taxId: '12-3456789',
      email: 'info@abc.com',
      phone: '(555) 123-4567',
      currency: 'USD',
      fiscalYearEnd: '12',
      dateFormat: 'MM/DD/YYYY',
      theme: 'light',
    }
  })

  const onSubmit = (data) => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your company and application settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        <button 
          onClick={() => setActiveTab('company')} 
          className={`px-4 py-2 transition-colors ${activeTab === 'company' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Company
        </button>
        <button 
          onClick={() => setActiveTab('accounting')} 
          className={`px-4 py-2 transition-colors ${activeTab === 'accounting' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Accounting
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`px-4 py-2 transition-colors ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('preferences')} 
          className={`px-4 py-2 transition-colors ${activeTab === 'preferences' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Preferences
        </button>
      </div>

      {activeTab === 'company' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-background border border-border rounded-lg p-6 space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold text-foreground mb-4">Company Information</h2>
          <FormInput label="Company Name" {...register('companyName')} error={errors.companyName?.message} />
          <FormInput label="Tax ID / EIN" {...register('taxId')} error={errors.taxId?.message} />
          <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <FormInput label="Phone" {...register('phone')} error={errors.phone?.message} />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
        </form>
      )}

      {activeTab === 'accounting' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-background border border-border rounded-lg p-6 space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold text-foreground mb-4">Accounting Settings</h2>
          <FormSelect label="Currency" {...register('currency')} options={[{label: 'USD', value: 'USD'}, {label: 'EUR', value: 'EUR'}, {label: 'GBP', value: 'GBP'}]} error={errors.currency?.message} />
          <FormSelect label="Fiscal Year Ends (Month)" {...register('fiscalYearEnd')} options={Array.from({length: 12}, (_, i) => ({label: String(i+1).padStart(2, '0'), value: String(i+1)}))} error={errors.fiscalYearEnd?.message} />
          <FormSelect label="Date Format" {...register('dateFormat')} options={[{label: 'MM/DD/YYYY', value: 'MM/DD/YYYY'}, {label: 'DD/MM/YYYY', value: 'DD/MM/YYYY'}, {label: 'YYYY-MM-DD', value: 'YYYY-MM-DD'}]} error={errors.dateFormat?.message} />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
        </form>
      )}

      {activeTab === 'users' && (
        <div className="bg-background border border-border rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-foreground mb-4">User Management</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@abc.com</p>
              </div>
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-medium">Admin</span>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Add User</button>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-background border border-border rounded-lg p-6 space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold text-foreground mb-4">User Preferences</h2>
          <FormSelect label="Theme" {...register('theme')} options={[{label: 'Light', value: 'light'}, {label: 'Dark', value: 'dark'}, {label: 'Auto', value: 'auto'}]} error={errors.theme?.message} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="notifications" defaultChecked className="rounded border border-input" />
            <label htmlFor="notifications" className="text-foreground">Enable Email Notifications</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="twoFactor" className="rounded border border-input" />
            <label htmlFor="twoFactor" className="text-foreground">Enable Two-Factor Authentication</label>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
        </form>
      )}
    </div>
  )
}
