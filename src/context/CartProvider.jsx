import { useEffect, useState } from 'react'
import { CartContext } from './CartContext.js'

const STORAGE_KEY = 'jbe_enquiry_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save enquiry cart:', e)
    }
  }, [items])

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
