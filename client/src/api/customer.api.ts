const BASE_URL = "http://localhost:5000/api";

export type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  gstNumber?: string | null;
  createdAt: string;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${BASE_URL}/customers`);
  const data = await res.json();

  return data.customers ?? [];
};