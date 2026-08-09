import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (token: string, user: AuthUser) => {
        set({ token, user });
      },
      logout: () => {
        set({ token: null, user: null });
      },
      isAdmin: () => {
        return get().user?.role === 'Admin';
      },
    }),
    {
      name: 'wf_auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
