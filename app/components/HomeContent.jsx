'use client'

import { useSearchParams } from 'next/navigation'
import HomeClient from './HomeClient'

export default function HomeContent() {
  const searchParams = useSearchParams()
  
  return <HomeClient searchParams={searchParams} />
}