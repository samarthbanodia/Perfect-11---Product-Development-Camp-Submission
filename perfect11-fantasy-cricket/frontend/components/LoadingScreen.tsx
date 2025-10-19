'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      {/* Animated cricket ball */}
      <motion.div
        className="relative mb-8"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-2xl shadow-red-500/50 flex items-center justify-center">
          <div className="w-20 h-1 bg-white/80 rounded-full" />
          <div className="absolute w-20 h-1 bg-white/80 rounded-full transform -rotate-45" />
        </div>
      </motion.div>

      {/* Perfect 11 Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Image
          src="/perfect_11_logo.png"
          alt="Perfect 11"
          width={200}
          height={200}
          className="drop-shadow-2xl"
        />
      </motion.div>

      {/* Loading text */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-4xl font-bold text-white mb-4 tracking-wider"
      >
        PERFECT 11
      </motion.h1>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-purple-900/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-4 text-purple-300 text-sm"
      >
        Loading your dream team...
      </motion.p>
    </div>
  )
}
