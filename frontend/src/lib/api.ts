const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  access_token?: string;
  token_type?: string;
  [key: string]: any; // Allow for other top-level fields
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'An error occurred', errors: data.errors };
      }

      return data;
    } catch (error) {
      return { error: 'Network error. Please check your connection.' };
    }
  }

  // Auth
  async register(name: string, email: string, password: string, password_confirmation: string) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; data: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/logout', { method: 'POST' });
    this.clearToken();
    return response;
  }

  async getMe() {
    return this.request('/me');
  }

  // Wallet
  async getWalletBalance() {
    return this.request<{ balance: number }>('/wallet/balance');
  }

  async deposit(amount: number) {
    return this.request('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async withdraw(amount: number) {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Stocks
  async getStocks<T = any>(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request<T>(`/stocks${params}`);
  }

  async getStock<T = any>(id: number) {
    return this.request<T>(`/stocks/${id}`);
  }

  async getStockHistory<T = any>(id: number, interval = '1d', limit = 100) {
    return this.request<T>(`/stocks/${id}/history?interval=${interval}&limit=${limit}`);
  }

  async getMarketSummary() {
    return this.request('/market/summary');
  }

  // Orders
  async getOrders<T = any>() {
    return this.request<T>('/orders');
  }

  async placeOrder(stockId: number, type: 'buy' | 'sell', quantity: number, price: number, orderType = 'market') {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        stock_id: stockId,
        type,
        quantity,
        price,
        order_type: orderType,
      }),
    });
  }

  async cancelOrder(orderId: number) {
    return this.request(`/orders/${orderId}/cancel`, { method: 'POST' });
  }

  // AI Co-Pilot
  async coPilotChat(message: string) {
    return this.request<{ reply: string }>('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const api = new ApiClient();
export default api;
