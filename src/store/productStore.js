import { create } from 'zustand'

export const useProductStore = create((set) => ({
  products: [],
  
  setProducts: (products) => set({ 
    products: products.map(p => ({ ...p, id: p._id || p.id }))
  }),
  
  addProduct: (product) =>
    set((state) => ({ 
      products: [...state.products, { ...product, id: product._id || product.id }] 
    })),
  
  updateProduct: (id, updated) =>
    set((state) => ({
      products: state.products.map((p) =>
        (p.id === id || p._id === id) ? { ...p, ...updated, id: id } : p
      ),
    })),
  
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => (p.id !== id && p._id !== id)),
    })),
}))
