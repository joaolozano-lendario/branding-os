/**
 * Auth Store
 * BRAND-019: Authentication state management
 * BRAND-030: Enhanced with error handling
 * Simple auth store for MVP (can be extended with real auth later)
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null })
        try {
          // MVP: Simulate login - replace with real auth
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Basic validation
          if (!email.includes("@")) {
            set({ error: "Invalid email format", isLoading: false })
            return false
          }

          set({
            user: {
              id: "user-1",
              email,
              name: email.split("@")[0],
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        } catch {
          set({ error: "Login failed. Please try again.", isLoading: false })
          return false
        }
      },

      register: async (email: string, _password: string, name: string) => {
        set({ isLoading: true, error: null })
        try {
          // MVP: Simulate registration - replace with real auth
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Basic validation
          if (!email.includes("@")) {
            set({ error: "Invalid email format", isLoading: false })
            return false
          }
          if (name.length < 2) {
            set({ error: "Name must be at least 2 characters", isLoading: false })
            return false
          }

          set({
            user: {
              id: "user-1",
              email,
              name,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        } catch {
          set({ error: "Registration failed. Please try again.", isLoading: false })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "branding-os-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
