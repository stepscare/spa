import { create } from 'zustand';

interface AuthState {
  user: { email: string } | null;
  token: string | null;
  setUser: (user: { email: string } | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  })(),
  token: (() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  })(),
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user });
  },
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token || '');
    }
    set({ token });
  },
  clearUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
