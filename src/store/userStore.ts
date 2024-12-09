import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  pipelines: string[];
}

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = create<UserState>(() => ({
  profile: null,
  loading: false,
  error: null
}));