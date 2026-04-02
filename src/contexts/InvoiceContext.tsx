import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentEntry {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'online' | 'advance';
  note?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  description?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxableAmount: number;
  gstEnabled: boolean;
  gstAmount: number;
  totalAmount: number;
  cashAmount: number;
  onlineAmount: number;
  advanceAmount: number;
  advanceMethod: 'cash' | 'online';
  remainingAmount: number;
  paymentStatus: 'completed' | 'pending';
  createdAt: string;
  isPrivate?: boolean;
  paymentHistory?: PaymentEntry[];
  isDelivered?: boolean;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (id: string, status: 'completed' | 'pending') => void;
  deleteInvoice: (id: string) => void;
  togglePrivate: (id: string) => void;
  totalRevenue: number;
}

const InvoiceContext = createContext<InvoiceContextType | null>(null);

const sampleInvoices: Invoice[] = [
  {
    id: '1', invoiceNumber: 'INV-001', customerName: 'Ravi Sharma',
    customerPhone: '9876543210', items: [
      { name: 'Photo Retouching', quantity: 5, price: 800 },
      { name: 'Background Removal', quantity: 10, price: 200 },
    ],
    subtotal: 6000, discount: 1200, taxableAmount: 4800, gstEnabled: true,
    gstAmount: 864, totalAmount: 5664, cashAmount: 5664, onlineAmount: 0, 
    advanceAmount: 0, advanceMethod: 'cash', remainingAmount: 0, paymentStatus: 'completed', createdAt: '2026-03-20',
  },
  {
    id: '2', invoiceNumber: 'INV-002', customerName: 'Priya Patel',
    customerPhone: '9123456789', items: [
      { name: 'Logo Design', quantity: 1, price: 5000 },
      { name: 'Social Media Kit', quantity: 1, price: 3000 },
    ],
    subtotal: 8000, discount: 1600, taxableAmount: 6400, gstEnabled: true,
    gstAmount: 1152, totalAmount: 7552, cashAmount: 0, onlineAmount: 0,
    advanceAmount: 1000, advanceMethod: 'cash', remainingAmount: 6552, paymentStatus: 'pending', createdAt: '2026-03-21',
  },
  {
    id: '3', invoiceNumber: 'INV-003', customerName: 'Amit Verma',
    items: [
      { name: 'Photo Editing Batch', quantity: 20, price: 150 },
    ],
    subtotal: 3000, discount: 600, taxableAmount: 2400, gstEnabled: false,
    gstAmount: 0, totalAmount: 2400, cashAmount: 2400, onlineAmount: 0, 
    advanceAmount: 0, advanceMethod: 'online', remainingAmount: 0, paymentStatus: 'completed', createdAt: '2026-03-22',
  },
  {
    id: '4', invoiceNumber: 'INV-004', customerName: 'Sneha Gupta',
    items: [
      { name: 'Banner Design', quantity: 3, price: 1500 },
      { name: 'Flyer Design', quantity: 2, price: 800 },
    ],
    subtotal: 6100, discount: 1220, taxableAmount: 4880, gstEnabled: true,
    gstAmount: 878.4, totalAmount: 5758.4, cashAmount: 0, onlineAmount: 0,
    advanceAmount: 5758.4, advanceMethod: 'online', remainingAmount: 0, paymentStatus: 'pending', createdAt: '2026-03-22',
  },
];

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('billing_invoices');
    return saved ? JSON.parse(saved) : sampleInvoices;
  });

  useEffect(() => {
    localStorage.setItem('billing_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = useCallback((invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  }, []);

  const updateInvoice = useCallback((updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  }, []);

  const updateInvoiceStatus = useCallback((id: string, status: 'completed' | 'pending') => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, paymentStatus: status } : inv));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const togglePrivate = useCallback((id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, isPrivate: !inv.isPrivate } : inv));
  }, []);

  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, updateInvoiceStatus, deleteInvoice, togglePrivate, totalRevenue }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider');
  return ctx;
}
