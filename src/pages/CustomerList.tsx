import { useState } from 'react';
import { useCustomers, type Customer } from '@/contexts/CustomerContext';
import { UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerList() {
  const { customers, addCustomer, deleteCustomer } = useCustomers();
  
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) {
      toast.error('Please fill in both fields');
      return;
    }
    addCustomer({
      id: crypto.randomUUID(),
      name,
      contact
    });
    toast.success('Customer added successfully');
    setName('');
    setContact('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Customer List</h1>
        <p className="text-sm text-muted-foreground mt-1">Directory of all your customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {/* Add Customer Form */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 sticky top-6">
            <h2 className="font-semibold text-lg mb-4">Add New Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Customer Name"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Contact</label>
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone or Email"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <UserPlus className="w-4 h-4" /> Add Customer
              </button>
            </form>
          </div>
        </div>

        {/* Customer Table */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="text-left px-5 py-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-5 py-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-center px-5 py-4 font-medium text-muted-foreground w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">No customers found.</td>
                  </tr>
                ) : (
                  customers.map(customer => (
                    <tr key={customer.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-medium text-card-foreground">{customer.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{customer.contact}</td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => deleteCustomer(customer.id)} className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
