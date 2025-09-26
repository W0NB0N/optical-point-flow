const API_BASE_URL = 'http://127.0.0.1:5000';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard endpoints
  async getDashboardSalesSummary() {
    return this.request('/dashboard/sales-summary');
  }

  async getDashboardRecentSales() {
    return this.request('/dashboard/recent-sales');
  }

  async getDashboardEvents() {
    return this.request('/dashboard/events');
  }

  // Customer endpoints
  async getCustomers(query?: string) {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request(`/customers${params}`);
  }

  async addCustomer(customerData: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async getCustomer(id: number) {
    return this.request(`/customers/${id}`);
  }

  async updateCustomer(id: number, customerData: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async getCustomerPrescriptions(id: number) {
    return this.request(`/customers/${id}/prescriptions`);
  }

  // Product endpoints
  async getProducts() {
    return this.request('/products');
  }

  async addProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Service endpoints
  async getServices() {
    return this.request('/services');
  }

  async addService(serviceData: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: number) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Sale endpoints
  async getSales(filters?: any) {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.customer_name) params.append('customer_name', filters.customer_name);
    if (filters?.status) params.append('status', filters.status);
    
    const query = params.toString();
    return this.request(`/sales${query ? `?${query}` : ''}`);
  }

  async addSale(saleData: any) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  async getSale(id: number) {
    return this.request(`/sales/${id}`);
  }

  // Payment endpoints
  async addPayment(paymentData: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Expenses (Cashbook)
  async addExpense(expenseData: any) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  // Prescription endpoints
  async addPrescription(prescriptionData: any) {
    return this.request('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  }
}

export const apiService = new ApiService();