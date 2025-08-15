
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../services/apiClient.ts';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const { user, token } = await apiClient.login(email, password);
        set({ user, token, isAuthenticated: true });
      },
      register: async (email, password) => {
        const { user, token } = await apiClient.register(email, password);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        apiClient.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },
      checkAuth: () => {
        const token = get().token;
        if (token) {
          // In a real app, you'd validate the token here
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in storage (must be unique)
    }
  )
);