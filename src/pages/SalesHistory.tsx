import { useState } from 'react';
import { useInvoices, type Invoice } from '@/contexts/InvoiceContext';
import InvoicePreview from '@/components/InvoicePreview';
import { FileText, Pencil, Trash2, CheckCircle, Package, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 0 });

export default function SalesHistory() {
  const { invoices, updateInvoice, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const navigate = useNavigate();

  // Only show public bills in Sales History
  const publicInvoices = invoices.filter(i => !i.isPrivate);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const reminderInvoices = publicInvoices.filter(i => !i.isDelivered && new Date(i.createdAt) < oneWeekAgo);

  const sendReminder = (inv: Invoice) => {
    if (!inv.customerPhone) {
      alert('Cannot send reminder: No phone number saved for this customer.');
      return;
    }
    
    let text = '';
    if (inv.paymentStatus === 'pending') {
      text = `Hello ${inv.customerName},\n\nYour order from PhotoBill Pro is complete! Please pay your pending amount of ${fmt(inv.remainingAmount)} and take your order.\n\nThank you!`;
    } else {
      text = `Hello ${inv.customerName},\n\nThank you! Your amount is successfully paid. Please visit our studio and collect your order.\n\nThank you!`;
    }

    const phone = inv.customerPhone.replace(/\D/g, '');
    const finalPhone = phone.length === 10 ? '91' + phone : phone;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renderTableHeader = () => (
    <thead>
      <tr className="border-b border-border/50 bg-muted/20">
        <th className="text-left px-5 py-4 font-medium text-muted-foreground">Invoice #</th>
        <th className="text-left px-5 py-4 font-medium text-muted-foreground">Customer</th>
        <th className="text-right px-5 py-4 font-medium text-muted-foreground">Date</th>
        <th className="text-right px-5 py-4 font-medium text-muted-foreground">Total</th>
        <th className="text-right px-5 py-4 font-medium text-muted-foreground text-amber-600/80">Cash</th>
        <th className="text-right px-5 py-4 font-medium text-muted-foreground text-blue-600/80">Online</th>
        <th className="text-right px-5 py-4 font-medium text-muted-foreground text-primary/80">Advance</th>
        <th className="text-right px-5 py-4 font-medium text-muted-foreground text-destructive/80">Remaining</th>
        <th className="text-center px-5 py-4 font-medium text-muted-foreground">Status</th>
        <th className="text-right px-5 py-4 font-medium text-muted-foreground">Actions</th>
      </tr>
    </thead>
  );

  const renderInvoiceRow = (inv: Invoice) => (
    <tr key={inv.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-5 py-3 font-medium text-card-foreground">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          {inv.invoiceNumber}
        </div>
      </td>
      <td className="px-5 py-3">{inv.customerName}</td>
      <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
        <div className="text-xs font-medium">{new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
        <div className="text-[10px] opacity-60">{new Date(inv.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
      </td>
      <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">{fmt(inv.totalAmount)}</td>
      <td className="px-5 py-3 text-right tabular-nums text-amber-600 font-medium">{fmt(inv.cashAmount || 0)}</td>
      <td className="px-5 py-3 text-right tabular-nums text-blue-600 font-medium">{fmt(inv.onlineAmount || 0)}</td>
      <td className="px-5 py-3 text-right tabular-nums text-primary font-medium">
        {fmt(inv.advanceAmount || 0)}
        {inv.advanceAmount > 0 && <span className="text-[10px] ml-1 opacity-70 uppercase">({inv.advanceMethod})</span>}
      </td>
      <td className="px-5 py-3 text-right tabular-nums text-destructive font-bold">{fmt(inv.remainingAmount || 0)}</td>
      <td className="px-5 py-3 text-center">
        <div
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase',
            inv.paymentStatus === 'completed' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}
        >
          {inv.paymentStatus}
        </div>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          {inv.isDelivered ? (
            <div title="Order Delivered" className="flex items-center gap-1 p-1.5 px-2 rounded-md bg-emerald-500/10 text-emerald-600 cursor-default">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Given</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => updateInvoice({ ...inv, isDelivered: true })}
                title="Mark as Delivered to Customer"
                className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors outline-none"
              >
                <Package className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => sendReminder(inv)}
                title="Send Reminder via WhatsApp"
                className="p-1.5 rounded-md text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors outline-none"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => navigate(`/edit-bill/${inv.id}`)}
            title="Edit Invoice"
            className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors outline-none"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this invoice? The action cannot be undone.')) {
                deleteInvoice(inv.id);
              }
            }}
            title="Delete Invoice"
            className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.paymentStatus === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales History</h1>
          <p className="text-sm text-muted-foreground mt-1">{publicInvoices.length} public invoices in history</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(['all', 'completed', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize',
                filter === f ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-12 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {/* Reminders Alert Box */}
        {filter === 'all' && reminderInvoices.length > 0 && (
          <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/20 shadow-md shadow-indigo-100 dark:shadow-none space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-bl-full pointer-events-none" />
            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 relative z-10">
              <MessageSquare className="w-5 h-5" />
              Automated Reminders (Over 7 Days)
            </h2>
            <p className="text-sm text-indigo-900/70 dark:text-indigo-300/70 relative z-10 font-medium">
              These customers haven't picked up their orders for over a week! Click the WhatsApp icon to automatically generate and send them a text.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {reminderInvoices.map(inv => (
                <div key={inv.id} className="bg-white dark:bg-card border-indigo-200 dark:border-border p-4 rounded-xl border flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-foreground text-base truncate">{inv.customerName}</p>
                      <p className="text-xs text-muted-foreground">{inv.customerPhone || 'No phone number'}</p>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] uppercase font-black", inv.paymentStatus === 'completed' ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-600")}>
                      {inv.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-auto pt-2">
                    <button onClick={() => sendReminder(inv)} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Text
                    </button>
                    <button onClick={() => updateInvoice({ ...inv, isDelivered: true })} title="Mark Given" className="p-1.5 px-3 bg-card border border-border text-foreground hover:bg-muted font-bold text-xs rounded-lg transition-all flex items-center justify-center">
                      <Package className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Section */}
        {(filter === 'all' || filter === 'pending') && (publicInvoices.filter(i => i.paymentStatus === 'pending').length > 0) && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-destructive flex items-center gap-2 px-1">
              <div className="w-2 h-6 bg-destructive rounded-full" />
              Pending Payments
            </h2>
            <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {renderTableHeader()}
                  <tbody>
                    {publicInvoices.filter(i => i.paymentStatus === 'pending').map(inv => renderInvoiceRow(inv))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Completed Section */}
        {(filter === 'all' || filter === 'completed') && (publicInvoices.filter(i => i.paymentStatus === 'completed').length > 0) && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-success flex items-center gap-2 px-1">
              <div className="w-2 h-6 bg-success rounded-full" />
              Completed Payments
            </h2>
            <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {renderTableHeader()}
                  <tbody>
                    {publicInvoices.filter(i => i.paymentStatus === 'completed').map(inv => renderInvoiceRow(inv))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {publicInvoices.length === 0 && (
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-12 text-center text-muted-foreground animate-fade-in">
            No invoices generated yet.
          </div>
        )}

        {filter !== 'all' && publicInvoices.filter(i => i.paymentStatus === filter).length === 0 && (
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-12 text-center text-muted-foreground animate-fade-in">
            No {filter} invoices found.
          </div>
        )}
      </div>
    </div>
  );
}
