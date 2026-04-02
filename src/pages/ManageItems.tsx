import { useState } from 'react';
import { useItems, type Item } from '@/contexts/ItemContext';
import { PackagePlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

export default function ManageItems() {
  const { items, addItem, deleteItem } = useItems();
  
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !price) {
      toast.error('Please fill in both fields');
      return;
    }
    addItem({
      id: crypto.randomUUID(),
      itemName,
      price: Number(price)
    });
    toast.success('Item added successfully');
    setItemName('');
    setPrice('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage Items</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your services and products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {/* Add Item Form */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 sticky top-6">
            <h2 className="font-semibold text-lg mb-4">Add New Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Item Name</label>
                <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Logo Design"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Price</label>
                <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <PackagePlus className="w-4 h-4" /> Add Item
              </button>
            </form>
          </div>
        </div>

        {/* Item List */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="text-left px-5 py-4 font-medium text-muted-foreground">Item Name</th>
                  <th className="text-right px-5 py-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-center px-5 py-4 font-medium text-muted-foreground w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">No items found.</td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-medium text-card-foreground">{item.itemName}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-foreground">{fmt(item.price)}</td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors">
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
