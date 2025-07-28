import { create } from "zustand";

interface User {
  email: string;
}

interface UserStore {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email) =>
    set(() => ({
      user: { email },
      isAuthenticated: true,
    })),
  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),
}));
