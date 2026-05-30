const BASE_URL = "http://localhost:5000/api";

export type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
  gst: number;
};

export type InvoicePayload = {
  invoiceDate: string;
  dueDate?: string | null;
  customerId: string;
  paymentStatus: string;
  notes?: string;
  items: InvoiceItem[];
  cgst?: number;
  sgst?: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  total: number;
  createdAt: string;
  paymentStatus: string;
};

export const createInvoice = async (
  data: InvoicePayload
): Promise<Invoice> => {
  const res = await fetch(`${BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getInvoices = async (): Promise<Invoice[]> => {
  const res = await fetch(`${BASE_URL}/invoices`);
  return res.json();
};