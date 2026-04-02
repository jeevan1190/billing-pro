import { useState } from 'react';
import { usePurchases } from '@/contexts/PurchaseContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function PurchaseEntry() {
  const { addPurchase } = usePurchases();
  
  const [supplierName, setSupplierName] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || !itemName || !quantity || !price || !date) {
      toast.error('Please fill in all fields');
      return;
    }

    const qty = Number(quantity);
    const prc = Number(price);

    addPurchase({
      id: crypto.randomUUID(),
      supplierName,
      itemName,
      quantity: qty,
      price: prc,
      totalAmount: qty * prc,
      date,
    });

    toast.success('Purchase saved successfully!');
    setSupplierName('');
    setItemName('');
    setQuantity('');
    setPrice('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Purchase Entry</h1>
        <p className="text-sm text-muted-foreground mt-1">Record a new purchase from a supplier</p>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Supplier Name</label>
              <input type="text" value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder="e.g. Amazon"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-shadow" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Item Name</label>
              <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Printer Ink"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Quantity</label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="1"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Price</label>
              <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-shadow" />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 flex items-center gap-2 transition-all">
              <ShoppingCart className="w-4 h-4" />
              Save Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
