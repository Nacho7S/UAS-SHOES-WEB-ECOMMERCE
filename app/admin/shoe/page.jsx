'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Freeloader from '../../components/freeLoader'

export default function ShoeDashboard() {
  const router = useRouter()
  const [shoes, setShoes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalShoes: 0,
    limit: 10
  })
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  })

  const fetchShoes = async (page = 1, isInitial = true) => {
    try {
      if (isInitial) setIsLoading(true)
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.inStock && { inStock: 'true' }),
        ...(sortConfig.key && { sortBy: sortConfig.key }),
        order: sortConfig.direction
      })

      const response = await fetch(`/api/v1/shoe?${queryParams}`, {
        credentials: 'include' 
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch shoes')
      }

      const data = await response.json()
      
      if (data.success) {
        if (isInitial) {
          setShoes(data.data)
        } else {
          setShoes(prev => [...prev, ...data.data])
        }
        setPagination(data.pagination)
      }
    } catch (err) {
      console.error('Failed to fetch shoes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShoes(1, true)
  }, [searchTerm, filters, sortConfig])

  const handleSort = (key) => {
    let direction = 'desc'
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'
    }
    setSortConfig({ key, direction })
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(shoes.map(shoe => shoe._id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/v1/admin/shoe/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (response.status === 403) {
        alert('You do not have permission to delete shoes')
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        setShoes(prev => prev.filter(shoe => shoe._id !== id))
        setShowDeleteModal(false)
        setItemToDelete(null)
      } else {
        alert(data.message || 'Failed to delete shoe')
      }
    } catch (err) {
      console.error('Failed to delete shoe:', err)
      alert('Failed to delete shoe')
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedItems.length} items?`)) return
    
    try {
      const results = await Promise.allSettled(
        selectedItems.map(id => 
          fetch(`/api/v1/admin/shoe/${id}`, { 
            method: 'DELETE',
            credentials: 'include'
          })
        )
      )
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.ok).length
      setShoes(prev => prev.filter(shoe => !selectedItems.includes(shoe._id)))
      setSelectedItems([])
      alert(`Successfully deleted ${successful} items`)
    } catch (err) {
      console.error('Failed to bulk delete:', err)
    }
  }

  const handleQuickStockUpdate = async (id, currentStock, delta) => {
    try {
      const response = await fetch(`/api/v1/admin/shoe/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: delta })
      })

      if (!response.ok) throw new Error('Failed to update stock')

      const data = await response.json()
      if (data.success) {
        setShoes(prev => prev.map(shoe => 
          shoe._id === id ? { ...shoe, stock: data.data.newStock } : shoe
        ))
      }
    } catch (err) {
      console.error('Failed to update stock:', err)
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-red-100 text-red-800' }
    if (stock < 10) return { label: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' }
    return { label: 'In Stock', class: 'bg-green-100 text-green-800' }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shoe Inventory</h1>
              <p className="text-sm text-gray-500 mt-1">
                {pagination.totalShoes} total products
              </p>
            </div>
            <div className="flex gap-3">
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete ({selectedItems.length})
                </button>
              )}
              <Link
                href="/admin/shoe/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Shoe
              </Link>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, brand, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.brand}
                onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Brands</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Jordan">Jordan</option>
                <option value="New Balance">New Balance</option>
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      {isLoading ? (
        <Freeloader/>
      ): (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === shoes.length && shoes.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th 
                    onClick={() => handleSort('brand')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  >
                    <div className="flex items-center gap-1">
                      Brand
                      {sortConfig.key === 'brand' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortConfig.direction === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('price')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  >
                    <div className="flex items-center gap-1">
                      Price
                      {sortConfig.key === 'price' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortConfig.direction === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('stock')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  >
                    <div className="flex items-center gap-1">
                      Stock
                      {sortConfig.key === 'stock' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortConfig.direction === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    onClick={() => handleSort('createdAt')}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  >
                    <div className="flex items-center gap-1">
                      Added
                      {sortConfig.key === 'createdAt' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortConfig.direction === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shoes.map((shoe) => {
                  const stockStatus = getStockStatus(shoe.stock)
                  return (
                    <tr 
                      key={shoe._id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(shoe._id)}
                          onChange={() => handleSelectItem(shoe._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/admin/shoe/${shoe._id}`}
                          className="flex items-center gap-4 group/link"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {shoe.images?.[0] ? (
                              <Image
                                src={shoe.images[0]}
                                alt={shoe.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors">
                              {shoe.name}
                            </h3>
                            <p className="text-sm text-gray-500">{shoe.category}</p>
                            {shoe.color?.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {shoe.color.slice(0, 3).map((c, i) => (
                                  <div 
                                    key={i}
                                    className="w-3 h-3 rounded-full border border-gray-200"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                                {shoe.color.length > 3 && (
                                  <span className="text-xs text-gray-400">+{shoe.color.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shoe.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${shoe.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleQuickStockUpdate(shoe._id, shoe.stock, -1)}
                            disabled={shoe.stock <= 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{shoe.stock}</span>
                          <button 
                            onClick={() => handleQuickStockUpdate(shoe._id, shoe.stock, 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.class}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(shoe.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2  transition-opacity">
                          <Link
                            href={`/admin/shoe/${shoe._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => {
                              setItemToDelete(shoe)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {shoes.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shoes found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or add a new shoe.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {shoes.length} of {pagination.totalShoes} items
          </p>
          
          {pagination.currentPage < pagination.totalPages && (
            <button
              onClick={() => fetchShoes(pagination.currentPage + 1, false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      </div>
      )}
      

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold">Delete Shoe</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{itemToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setItemToDelete(null)
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(itemToDelete._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}