import { create } from 'zustand'

export const useSalesStore = create((set) => ({
  sales: [],
  revenue: 0,
  topProducts: [],

  setSales: (sales) => set({ sales }),
  setRevenue: (revenue) => set({ revenue }),
  setTopProducts: (topProducts) => set({ topProducts }),
}))
