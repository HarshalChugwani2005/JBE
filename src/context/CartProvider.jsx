import { useEffect, useState } from 'react'
import { CartContext } from './CartContext.js'

const STORAGE_KEY = 'jbe_enquiry_cart_v1'

export function CartProvider({ children }) {
  // Starts empty so the pre-rendered HTML and the first browser render match; the saved
  // list is restored right after mount.
  const [items, setItems] = useState([])
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : []
      if (Array.isArray(parsed) && parsed.length) setItems(parsed)
    } catch {
      // Unreadable storage: start with an empty list.
    }
    setRestored(true)
  }, [])

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!restored) return // don't overwrite the saved list with the initial empty one
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save enquiry cart:', e)
    }
  }, [items, restored])

  const addToCart = (product) => {
    const colorKey = product.selectedColor ? `-${product.selectedColor}` : ''
    const itemId = `${product.categorySlug}-${product.brand?.brand || product.brand}-${product.model?.modelName || product.modelName}${colorKey}`

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId)
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      }
      return [
        ...prev,
        {
          id: itemId,
          categorySlug: product.categorySlug,
          categoryLabel: product.categoryLabel,
          brand: product.brand?.brand || product.brand,
          modelName: product.model?.modelName || product.modelName,
          selectedColor: product.selectedColor || null,
          image: product.model?.image || product.image || null,
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const toggleCart = () => setIsOpen((prev) => !prev)
  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const totalCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isOpen,
        toggleCart,
        openCart,
        closeCart,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
