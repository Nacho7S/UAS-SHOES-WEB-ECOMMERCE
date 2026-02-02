'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/v1/user/cart', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setCart(data.data)
        }
      } else if (res.status === 401) {
        setCart(null)
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err)
    }
  }

  const addToCart = async (shoeId, size, color, quantity = 1) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ shoeId, size, color, quantity })
      })

      const data = await res.json()

      if (res.ok && data.success) {
     
        setCart(data.data.cart || data.data)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (err) {
      return { success: false, message: 'Network error' }
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    
    setIsLoading(true)
    try {
  

      const res = await fetch('/api/v1/user/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setCart(data.data.cart || data.data)
        return { success: true }
      }
    } catch (err) {
      console.error('Failed to update quantity:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/user/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await res.json()

      if (res.ok && data.success) {
        const updatedCart = data.data?.cart || data.data || data 
        if (updatedCart && updatedCart.items) {
          setCart(updatedCart)
        } else {
          setCart(prevCart => {
            if (!prevCart) return null
            const newItems = prevCart.items.filter(item => item._id !== itemId)
            const newSubtotal = newItems.reduce((sum, item) => sum + (item.priceAtAdd || 0) * item.quantity, 0)
            
            return {
              ...prevCart,
              items: newItems,
              totals: {
                ...prevCart.totals,
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
                subtotal: newSubtotal,
                total: newSubtotal - (prevCart.totals?.discount || 0)
              }
            }
          })
        }
        return { success: true }
      }
    } catch (err) {
      console.error('Failed to remove item:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/user/cart', {
        method: 'DELETE',
        credentials: 'include'
      })

      if (res.ok) {
        setCart(null)
        return { success: true }
      }
    } catch (err) {
      console.error('Failed to clear cart:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const itemCount = cart?.totals?.itemCount || cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const cartTotal = cart?.totals?.total || 0

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      itemCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)