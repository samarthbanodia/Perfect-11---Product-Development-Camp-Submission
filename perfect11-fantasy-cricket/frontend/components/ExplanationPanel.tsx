'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { X, Info, TrendingUp, Calculator, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ExplanationPanelProps {
  isOpen: boolean
  onClose: () => void
  player?: any
  explanationType: 'credits' | 'prediction' | 'team' | 'match'
  data?: any
}

export default function ExplanationPanel({
  isOpen,
  onClose,
  player,
  explanationType,
  data
}: ExplanationPanelProps) {
  const [explanation, setExplanation] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && player) {
      fetchExplanation()
    }
  }, [isOpen, player, explanationType])

  const fetchExplanation = async () => {
    setLoading(true)
    try {
      const payload = {
        type: explanationType,
        player_name: player?.player_name || '',
        role: player?.role || '',
        credits: player?.credits || 0,
        predicted_fp: player?.predicted_fp || 0,
        top_features: player?.attribution?.top_features || [],
        ...data
      }

      const response = await fetch('http://localhost:5000/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      setExplanation(result.explanation || 'No explanation available')
    } catch (error) {
      console.error('Failed to fetch explanation:', error)
      setExplanation('Failed to load explanation')
    } finally {
      setLoading(false)
    }
  }

  const getIcon = () => {
    switch (explanationType) {
      case 'credits':
        return Calculator
      case 'prediction':
        return TrendingUp
      case 'team':
        return Users
      case 'match':
        return Info
      default:
        return Info
    }
  }

  const getTitle = () => {
    switch (explanationType) {
      case 'credits':
        return 'Credits Calculation Explained'
      case 'prediction':
        return 'Prediction Breakdown'
      case 'team':
        return 'Team Selection Strategy'
      case 'match':
        return 'Match Context Analysis'
      default:
        return 'Explanation'
    }
  }

  const Icon = getIcon()

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-purple-500/30"
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30 flex items-center justify-between bg-purple-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
              {player && (
                <p className="text-purple-300 text-sm">
                  {player.player_name} ({player.role})
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-purple-700/50 hover:bg-purple-700 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="prose prose-invert prose-purple max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold text-white mb-3 mt-5" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-bold text-purple-200 mb-2 mt-4" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-purple-100 mb-3 leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside text-purple-100 mb-3 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside text-purple-100 mb-3 space-y-1" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-purple-900/50 px-2 py-1 rounded text-purple-200 font-mono text-sm" {...props} />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre className="bg-purple-900/50 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-white" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-purple-300" {...props} />
                  ),
                }}
              >
                {explanation}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
