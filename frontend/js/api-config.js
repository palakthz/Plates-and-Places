// API Configuration
const API_CONFIG = {
  baseURL: 'http://localhost:5000/api',
  
  // Helper function to get auth token
  getToken() {
    return localStorage.getItem('token');
  },
  
  // Helper function to set auth token
  setToken(token) {
    localStorage.setItem('token', token);
  },
  
  // Helper function to remove auth token
  removeToken() {
    localStorage.removeItem('token');
  },
  
  // Helper function to get headers with auth
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },
  
  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };
    
    try {
      console.log('API Request:', url, config);
      const response = await fetch(url, config);
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to backend server. Make sure the backend is running on http://localhost:5000');
      }
      throw error;
    }
  },
  
  // API Methods
  async register(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  },
  
  async logout() {
    this.removeToken();
    window.location.href = 'home.html';
  },
  
  async getCurrentUser() {
    return this.request('/auth/me');
  },
  
  async getRecipes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/recipes?${queryString}`);
  },
  
  async getRecipe(slug) {
    return this.request(`/recipes/${slug}`);
  },
  
  async createRecipe(recipeData) {
    return this.request('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  },
  
  async getStories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/stories?${queryString}`);
  },
  
  async getStory(slug) {
    return this.request(`/stories/${slug}`);
  },
  
  async createStory(storyData) {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  },
  
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  },
  
  async subscribeNewsletter(email, source = 'home') {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    });
  },
  
  async submitContact(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async getFAQs() {
    return this.request('/faq');
  },
};

// Make API_CONFIG available globally
window.API = API_CONFIG;

