export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  created_at: string;
}

export interface Service {
  id: number;
  description: string;
  rate: number;
}

export interface Invoice {
  id: string;
  client_id: string;
  client?: Client;
  items?: InvoiceItem[];
  logo_url?: string;
  status: "draft" | "sent" | "paid";
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  service_name: string;
  description: string;
  quantity: number;
  rate: number;
  created_at: string;
}
