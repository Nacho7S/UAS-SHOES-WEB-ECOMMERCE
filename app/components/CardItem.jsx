'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AddToCartButton from './addToCardButton'

export default function CardItem({ item }) {
  const router = useRouter()



  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => router.push(`/shoe/${item._id}`)}      
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image 
          src={item.images?.[0] || '/placeholder-shoe.png'}
          alt={item.name || 'Shoe image'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {item.brand && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold rounded-full text-gray-800">
            {item.brand}
          </span>
        )}

      </div>

      <div className="p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {item.category || 'Sneakers'}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.name}
        </h2>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${item.price}
            </span>
          </div>
          
          <AddToCartButton shoe={item} />
        </div>

        {item.color?.length > 0 && (
          <div className="flex gap-2 mt-3">
            {item.color.slice(0, 4).map((color, idx) => (
              <div 
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
            {item.color.length > 4 && (
              <span className="text-xs text-gray-500">+{item.color.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}