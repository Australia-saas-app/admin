"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/src/redux/hooks'

const Page = () => {
  const { isAuthenticated, token, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading) {
      if (!isAuthenticated && !token) {
        router.replace('/account/login')
      } else {
        router.replace('/dashboard')
      }
    }
  }, [mounted, isAuthenticated, token, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center font-bold bg-base-100">
      Redirecting...
    </div>
  )
}

export default Page