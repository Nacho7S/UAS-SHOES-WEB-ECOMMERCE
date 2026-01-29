'use client'

import { useCart } from '../provider/cartProvider'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Freeloader from '../components/freeLoader'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { cart, fetchCart, updateQuantity, removeItem, clearCart, isLoading } = useCart()
  const router = useRouter()
  const [removingItems, setRemovingItems] = useState(new Set())


  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemoveItem = async (itemId) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    try {
      await removeItem(itemId)
    } catch (err) {
      console.error('Failed to remove item:', err)
      alert('Failed to remove item')
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

 
  if (isLoading && !cart) {
    return <Freeloader />
  }

 
  if (!isLoading && (!cart || !cart.items || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added any shoes yet.</p>
          <button
            onClick={() => router.push('/home')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }


  const cartItems = cart?.items || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart ({cartItems.length})</h1>
          {cartItems.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart()
                }
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
       
              if (!item || !item.shoeId) return null
              
              const isRemoving = removingItems.has(item._id)
              
              return (
                <div 
                  key={item._id} 
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 transition-opacity ${isRemoving ? 'opacity-50' : ''}`}
                >
                  {/* Image */}
                  <div 
                    className="relative w-24 h-24 flex-shrink-0 cursor-pointer"
                    onClick={() => router.push(`/shoe/${item.shoeId?._id}`)}
                  >
                    <Image
                      src={item.shoeId?.images?.[0] || '/placeholder-shoe.png'}
                      alt={item.shoeId?.name || 'Shoe'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => router.push(`/shoe/${item.shoeId?._id}`)}
                        >
                          {item.shoeId?.name || 'Unknown Product'}
                        </h3>
                        <p className="text-sm text-gray-500">{item.shoeId?.brand || ''}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Size: <span className="font-medium">{item.size || '-'}</span></span>
                          <span className="flex items-center gap-1">
                            Color: 
                            {item.color && (
                              <>
                                <span 
                                  className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                                  style={{ backgroundColor: item.color }}
                                />
                                {item.color}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={isRemoving}
                        className="text-gray-400 hover:text-red-600 p-1 disabled:opacity-50"
                      >
                        {isRemoving ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isLoading}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${((item.priceAtAdd || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.priceAtAdd || 0} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart?.totals?.itemCount || cartItems.length} items)</span>
                    <span>${(cart?.totals?.subtotal || cartItems.reduce((sum, item) => sum + (item.priceAtAdd || 0) * item.quantity, 0)).toFixed(2)}</span>
                  </div>
                  
                  {(cart?.totals?.discount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${cart.totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${(cart?.totals?.total || cartItems.reduce((sum, item) => sum + (item.priceAtAdd || 0) * item.quantity, 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => router.push('/home')}
                  className="w-full mt-3 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}