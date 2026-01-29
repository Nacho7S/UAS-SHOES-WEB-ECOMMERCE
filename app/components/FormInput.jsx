'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ShoeFormPage({ params }) {
  const router = useRouter()
  const id = params === 'new' ? 'new' : React.use(params).id 
  const isNew = id === 'new'
  
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Nike',
    releaseYear: new Date().getFullYear(),
    description: '',
    price: '',
    stock: '',
    category: 'Sneakers',
    size: [],
    color: [],
    images: []
  })
  
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [newSize, setNewSize] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newImage, setNewImage] = useState('')

  const categories = ['Sneakers', 'Running', 'Basketball', 'Casual', 'Formal', 'Boots', 'Sandals']
  const brands = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Reebok', 'Converse', 'Vans', 'Asics', 'Under Armour']

  useEffect(() => {
    if (!isNew) fetchShoe()
  }, [id])

  const fetchShoe = async () => {
    try {
      const res = await fetch(`/api/v1/shoe/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setFormData(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch shoe:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (formData.size.length === 0) newErrors.size = 'At least one size is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSaving(true)
    
    try {
      const url = isNew ? '/api/v1/admin/shoe' : `/api/v1/admin/shoe/${id}`
      const method = isNew ? 'POST' : 'PUT'
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        releaseYear: Number(formData.releaseYear)
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        router.push('/admin/shoe')
        router.refresh()
      } else {
        setErrors({ submit: data.message || 'Failed to save shoe' })
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const addSize = () => {
    if (!newSize || formData.size.includes(Number(newSize))) return
    setFormData(prev => ({ ...prev, size: [...prev.size, Number(newSize)].sort((a, b) => a - b) }))
    setNewSize('')
  }

  const removeSize = (sizeToRemove) => {
    setFormData(prev => ({ ...prev, size: prev.size.filter(s => s !== sizeToRemove) }))
  }

  const addColor = () => {
    if (!newColor || formData.color.includes(newColor)) return
    setFormData(prev => ({ ...prev, color: [...prev.color, newColor] }))
    setNewColor('')
  }

  const removeColor = (colorToRemove) => {
    setFormData(prev => ({ ...prev, color: prev.color.filter(c => c !== colorToRemove) }))
  }

  const addImage = () => {
    if (!newImage || formData.images.includes(newImage)) return
    setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }))
    setNewImage('')
  }

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Add New Shoe' : 'Edit Shoe'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isNew ? 'Create a new product listing' : 'Update product information'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Air Jordan 1 Retro High OG"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                  </div>

                  {/* Release Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release Year
                    </label>
                    <input
                      type="number"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleChange}
                      min="1980"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.stock ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description..."
                />
              </div>

              <hr className="border-gray-200" />

              {/* Sizes */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Sizes <span className="text-red-500">*</span>
                </h2>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="e.g., 42"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Add Size
                  </button>
                </div>
                {errors.size && <p className="mb-2 text-sm text-red-500">{errors.size}</p>}
                <div className="flex flex-wrap gap-2">
                  {formData.size.map(size => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      US {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="hover:text-blue-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Colors */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Colors</h2>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="e.g., Black/Red"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Add Color
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.color.map(color => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ 
                          backgroundColor: color.toLowerCase().includes('black') ? '#000' : 
                                          color.toLowerCase().includes('white') ? '#fff' :
                                          color.toLowerCase().includes('red') ? '#ef4444' :
                                          color.toLowerCase().includes('blue') ? '#3b82f6' :
                                          color.split('/')[0].toLowerCase()
                        }}
                      />
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Images */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Add Image
                  </button>
                </div>
                
                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={img}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isNew ? 'Create Shoe' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}