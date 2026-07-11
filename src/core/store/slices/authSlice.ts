import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock or actual implementation for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 0));

      // TODO: Replace with actual API call
      // const response = await axiosInstance.post('/auth/login', credentials);
      // return response.data;
      if (credentials.email && credentials.password) {
        return { token: 'mock-jwt-token', user: { email: credentials.email, role: 'admin' } };
      }
      return rejectWithValue('Invalid credentials');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrate: (state) => {
      // Disabled auto-login from localStorage as requested so users always see the login page first.
      // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // if (token) { ... }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { hydrate, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
