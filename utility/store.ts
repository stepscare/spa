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
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  })(),
  token: localStorage.getItem('token'),
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    localStorage.setItem('token', token || '');
    set({ token });
  },
  clearUser: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
