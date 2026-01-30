'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../../provider/cartProvider'

export default function ShoeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  
  const [shoe, setShoe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    fetchShoeDetail()
  }, [params.id])

  const fetchShoeDetail = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/v1/shoe/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setShoe(data.data)

        if (data.data.color?.length > 0) {
          setSelectedColor(data.data.color[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch shoe:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    setIsAddingToCart(true)
    const result = await addToCart(shoe._id, selectedSize, selectedColor, quantity)
    setIsAddingToCart(false)

    if (result.success) {
      alert('Added to cart!')
    } else {
      alert(result.message || 'Failed to add to cart')
    }
  }

  const nextImage = () => {
    if (shoe?.images?.length) {
      setSelectedImage((prev) => (prev + 1) % shoe.images.length)
    }
  }

  const prevImage = () => {
    if (shoe?.images?.length) {
      setSelectedImage((prev) => (prev - 1 + shoe.images.length) % shoe.images.length)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!shoe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Shoe not found</h2>
          <button 
            onClick={() => router.push('/home')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/home" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/home/?brand=${shoe.brand}`} className="hover:text-blue-600 transition-colors">
              {shoe.brand}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">
              {shoe.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
     
          <div className="space-y-4">
 
            <div className="relative aspect-4/3 bg-gray-100 rounded-2xl overflow-hidden group">
              {shoe.images?.[selectedImage] ? (
                <Image
                  src={shoe.images[selectedImage]}
                  alt={shoe.name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

    
              {shoe.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

  
              {shoe.images?.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {shoe.images.length}
                </div>
              )}
            </div>


            {shoe.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {shoe.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${shoe.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

 
          <div className="space-y-6">
   
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  {shoe.brand}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                  {shoe.category}
                </span>
                {shoe.stock === 0 ? (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                    Out of Stock
                  </span>
                ) : shoe.stock < 10 ? (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-medium rounded-full">
                    Low Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                    In Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {shoe.name}
              </h1>
              
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${shoe.price}
                </span>
                {shoe.releaseYear && (
                  <span className="text-gray-500">
                    Released {shoe.releaseYear}
                  </span>
                )}
              </div>
            </div>

  
            {shoe.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {shoe.description}
                </p>
              </div>
            )}

          
            {shoe.color?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Color: <span className="text-gray-500">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {shoe.color.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ 
                          backgroundColor: color.toLowerCase().includes('black') ? '#000' :
                                          color.toLowerCase().includes('white') ? '#fff' :
                                          color.toLowerCase().split('/')[0]
                        }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

        
            {shoe.size?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Size: {selectedSize ? `US ${selectedSize}` : 'Select a size'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {shoe.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : 'border-gray-200 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

   
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(shoe.stock, quantity + 1))}
                  disabled={quantity >= shoe.stock}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  {shoe.stock} available
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || shoe.stock === 0 || isAddingToCart}
                className="w-full py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {shoe.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>
              
              {!selectedSize && (
                <p className="mt-2 text-sm text-red-500 text-center">Please select a size</p>
              )}
              {!selectedColor && (
                <p className="mt-2 text-sm text-red-500 text-center">Please select a color</p>
              )}
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free shipping on orders over $100
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                30-day return policy
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}