import { Suspense } from 'react'
import HomeContent from '../components/HomeContent'

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}