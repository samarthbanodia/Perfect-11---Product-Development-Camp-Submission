'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import WelcomeScreen from '@/components/WelcomeScreen'

export default function Home() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <WelcomeScreen />
      )}
    </>
  )
}
