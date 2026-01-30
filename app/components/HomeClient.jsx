'use client'

import { useEffect, useState, useRef, useCallback, useMemo, Suspense } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import CardItem from './CardItem';

export default function HomeClient({searchParams}) {
  const router = useRouter();
  const pathname = usePathname();


  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    category: ''
  });
  
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    order: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [totalShoes, setTotalShoes] = useState(0);
  const [isInitialMount, setIsInitialMount] = useState(true);
  
  const observerRef = useRef(null);
  const loaderRef = useRef(null);
  const searchTimeoutRef = useRef(null);


  useEffect(() => {
    const search = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const inStock = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    setSearchTerm(search);
    setDebouncedSearch(search);
    setFilters({ brand, minPrice, maxPrice, inStock, category });
    setSortConfig({ sortBy, order });
    setIsInitialMount(false);
  }, []); 


  useEffect(() => {
    if (isInitialMount) return;

    const current = new URLSearchParams();
    
    
    if (debouncedSearch) current.set('search', debouncedSearch);
    if (filters.brand) current.set('brand', filters.brand);
    if (filters.category) current.set('category', filters.category);
    if (filters.minPrice) current.set('minPrice', filters.minPrice);
    if (filters.maxPrice) current.set('maxPrice', filters.maxPrice);
    if (filters.inStock) current.set('inStock', 'true');
    if (sortConfig.sortBy !== 'createdAt') current.set('sortBy', sortConfig.sortBy);
    if (sortConfig.order !== 'desc') current.set('order', sortConfig.order);

    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`${pathname}${query}`, { scroll: false });
  }, [debouncedSearch, filters, sortConfig, isInitialMount, pathname, router]);

  
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  
  useEffect(() => {
    if (isInitialMount) return;
    
    setPage(1);
    setShoes([]);
    fetchShoes(1, true);
  }, [debouncedSearch, filters, sortConfig, isInitialMount]);

 
  useEffect(() => {
    if (isLoadingMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, page]);

  const fetchShoes = async (pageNum, isInitial = false) => {
    try {
      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.inStock && { inStock: 'true' }),
        ...(filters.category && { category: filters.category }),
        sortBy: sortConfig.sortBy,
        order: sortConfig.order
      });

      const response = await fetch(`/api/v1/shoe?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        if (isInitial) {
          setShoes(data.data);
        } else {
          setShoes(prev => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 12);
        setPage(pageNum);
        setTotalShoes(data.pagination?.totalShoes || 0);
      }
    } catch (err) {
      console.error('Failed to fetch shoes:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchShoes(page + 1, false);
    }
  }, [page, isLoadingMore, hasMore]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (sortBy, order) => {
    setSortConfig({ sortBy, order });
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      category: ''
    });
    setSearchTerm('');
    setDebouncedSearch('');
    setSortConfig({ sortBy: 'createdAt', order: 'desc' });
  };

  const hasActiveFilters = useMemo(() => 
    filters.brand || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.inStock || 
    filters.category ||
    debouncedSearch ||
    sortConfig.sortBy !== 'createdAt' ||
    sortConfig.order !== 'desc'
  , [filters, debouncedSearch, sortConfig]);

  const brands = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Reebok', 'Converse', 'Vans', 'Asics', 'Under Armour'];
  const categories = ['Sneakers', 'Running', 'Basketball', 'Casual', 'Formal', 'Boots', 'Sandals'];
  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First', sortBy: 'createdAt', order: 'desc' },
    { value: 'createdAt-asc', label: 'Oldest First', sortBy: 'createdAt', order: 'asc' },
    { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', order: 'asc' },
    { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', order: 'desc' },
    { value: 'name-asc', label: 'Name: A-Z', sortBy: 'name', order: 'asc' },
    { value: 'name-desc', label: 'Name: Z-A', sortBy: 'name', order: 'desc' }
  ];

  const currentSortValue = `${sortConfig.sortBy}-${sortConfig.order}`;

  
  if (isInitialMount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Drops</h1>
              <p className="text-gray-600 mt-1">Discover the hottest sneakers of the season</p>
            </div>
            <div className="text-sm text-gray-500">
              {totalShoes > 0 && `${totalShoes} products available`}
            </div>
          </div>

          {/* Search & Controls */}
          <div className="mt-6 flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex gap-3">
              <select
                value={currentSortValue}
                onChange={(e) => {
                  const option = sortOptions.find(opt => opt.value === e.target.value);
                  if (option) {
                    handleSortChange(option.sortBy, option.order);
                  }
                }}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 border rounded-xl flex items-center gap-2 transition-colors ${
                  showFilters || hasActiveFilters 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {[
                      filters.brand, 
                      filters.category, 
                      filters.minPrice, 
                      filters.maxPrice, 
                      filters.inStock, 
                      debouncedSearch,
                      sortConfig.sortBy !== 'createdAt' || sortConfig.order !== 'desc' ? 'sort' : null
                    ].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* In Stock Toggle */}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors w-full">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">In Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Active Filters Tags */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    {debouncedSearch && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Search: "{debouncedSearch}"
                        <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {filters.brand && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {filters.brand}
                        <button onClick={() => handleFilterChange('brand', '')} className="hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {filters.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {filters.category}
                        <button onClick={() => handleFilterChange('category', '')} className="hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                        <button onClick={() => { 
                          handleFilterChange('minPrice', ''); 
                          handleFilterChange('maxPrice', ''); 
                        }} className="hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {filters.inStock && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        In Stock
                        <button onClick={() => handleFilterChange('inStock', false)} className="hover:text-green-900">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {(sortConfig.sortBy !== 'createdAt' || sortConfig.order !== 'desc') && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Sorted: {sortOptions.find(o => o.value === currentSortValue)?.label}
                        <button onClick={() => handleSortChange('createdAt', 'desc')} className="hover:text-purple-900">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-700 underline ml-auto"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shoes.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No shoes found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          isLoading ? ( 
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shoes.map((el) => (
                <CardItem item={el} key={el._id} />
              ))}
            </div>
          )
        )}

        {/* Loading & End States */}
        <div 
          ref={loaderRef}
          className="mt-12 flex flex-col items-center justify-center py-8"
        >
          {isLoadingMore && (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="text-gray-600 font-medium">Loading more kicks...</span>
            </div>
          )}
          
          {!hasMore && shoes.length > 0 && (
            <div className="text-center">
              <p className="text-gray-500 font-medium">You've reached the end! 🎉</p>
              <p className="text-sm text-gray-400 mt-1">{shoes.length} items shown</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}