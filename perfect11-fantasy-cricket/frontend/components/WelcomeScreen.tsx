'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="mb-12"
      >
        <Image
          src="/perfect_11_logo.png"
          alt="Perfect 11"
          width={250}
          height={250}
          className="drop-shadow-2xl"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-6xl font-bold text-white mb-4 text-center tracking-wider"
      >
        PERFECT 11
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-purple-300 mb-12 text-center max-w-md"
      >
        Build your dream IPL team with AI-powered predictions
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/auth')}
        className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
      >
        Get Started
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 flex flex-col items-center space-y-4"
      >
        <div className="flex items-center space-x-8 text-purple-300">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">1000+</div>
            <div className="text-sm">Players Analyzed</div>
          </div>
          <div className="w-px h-12 bg-purple-500/50" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">AI-Powered</div>
            <div className="text-sm">Predictions</div>
          </div>
          <div className="w-px h-12 bg-purple-500/50" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">Smart</div>
            <div className="text-sm">Team Selection</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
