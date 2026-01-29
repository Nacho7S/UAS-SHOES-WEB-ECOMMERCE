'use client'

import { useState } from 'react'
import { useCart } from '../provider/cartProvider'

export default function AddToCartButton({ shoe, selectedSize, selectedColor }) {
  const { addToCart, isLoading } = useCart()
  const [showSizeColorModal, setShowSizeColorModal] = useState(false)
  const [localSize, setLocalSize] = useState(selectedSize || '')
  const [localColor, setLocalColor] = useState(selectedColor || '')
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    e.preventDefault()


    if (!localSize || !localColor) {
      setShowSizeColorModal(true)
      return
    }

    const result = await addToCart(shoe._id, localSize, localColor, quantity)
    
    if (result.success) {
      setShowSizeColorModal(false)
      alert('Added to cart!')
    }
  }

  const handleDirectAdd = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (!localSize || !localColor) {
      setShowSizeColorModal(true)
      return
    }

    await addToCart(shoe._id, localSize, localColor, quantity)
    setShowSizeColorModal(false)
  }

  return (
    <>
      <button 
        onClick={handleAddToCart}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors active:scale-95 disabled:opacity-50 z-10"
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>


      {showSizeColorModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Select Options</h3>
 
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {shoe.size?.map(size => (
                  <button
                    key={size}
                    onClick={() => setLocalSize(size)}
                    className={`px-3 py-2 border rounded-lg text-sm ${
                      localSize === size 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

         
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {shoe.color?.map(color => (
                  <button
                    key={color}
                    onClick={() => setLocalColor(color)}
                    className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-2 ${
                      localColor === color 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

        
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

         
            <div className="flex gap-3">
              <button
                onClick={() => setShowSizeColorModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDirectAdd}
                disabled={!localSize || !localColor || isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}