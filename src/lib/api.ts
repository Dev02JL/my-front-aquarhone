const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  activityType: 'kayak' | 'paddle' | 'canoe' | 'croisiere';
  location: string;
  availableSlots: string[];
  price: string;
  remainingSpots: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  activity: {
    id: number;
    name: string;
    activityType: string;
    location: string;
    price: string;
  };
  dateTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const api = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Une erreur est survenue',
        };
      }

      return { data };
    } catch (error) {
      return {
        error: 'Erreur de connexion au serveur',
      };
    }
  },

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<User>('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Activities endpoints
  async getActivities(): Promise<ApiResponse<Activity[]>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Activity[]>('/api/activities', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getActivity(id: number): Promise<ApiResponse<Activity>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Activity>(`/api/activities/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async createActivity(activityData: Partial<Activity>): Promise<ApiResponse<Activity>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Activity>('/api/activities', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });
  },

  async updateActivity(id: number, activityData: Partial<Activity>): Promise<ApiResponse<Activity>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Activity>(`/api/activities/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });
  },

  async deleteActivity(id: number): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<void>(`/api/activities/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Reservations endpoints
  async getReservations(): Promise<ApiResponse<Reservation[]>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Reservation[]>('/api/reservations', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getReservation(id: number): Promise<ApiResponse<Reservation>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Reservation>(`/api/reservations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async createReservation(activityId: number, dateTime: string): Promise<ApiResponse<Reservation>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Reservation>('/api/reservations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ activityId, dateTime }),
    });
  },

  async cancelReservation(id: number): Promise<ApiResponse<Reservation>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<Reservation>(`/api/reservations/${id}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Admin endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<User[]>('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getUser(id: number): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<User>(`/api/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async createUser(userData: { email: string; password: string; roles?: string[] }): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<User>('/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: 'Token non trouvé' };
    }

    return this.request<void>(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
}; 