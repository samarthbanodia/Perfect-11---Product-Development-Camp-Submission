'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import CricketField from '@/components/CricketField'
import Sidebar from '@/components/Sidebar'
import ExplanationPanel from '@/components/ExplanationPanel'
import AttributionChart from '@/components/AttributionChart'
import TestSubmission from '@/components/TestSubmission'
import RulesSection from '@/components/RulesSection'
import { Upload, RefreshCw, Download, Trophy, TrendingUp, Info, Calculator, Sparkles, History } from 'lucide-react'

// Dynamic import for 3D component (client-side only)
const CricketBall3D = dynamic(() => import('@/components/CricketBall3D'), { ssr: false })

interface Player {
  rank: number
  player_id: string
  player_name: string
  team: string
  role: string
  predicted_fp: number
  credits: number
  attribution?: any
}

interface PredictionResponse {
  match_info: {
    match_id: string
    match_date: string
    team1: string
    team2: string
    venue: string
  }
  recommended_xi: Player[]
  budget_info: {
    total_credits_used: number
    total_credits_available: number
    credits_remaining: number
    role_distribution: Record<string, number>
    team_distribution: Record<string, number>
    constraints_satisfied: boolean
  }
  predictions_summary: {
    total_predicted_fp: number
    average_predicted_fp: number
  }
}

export default function EnhancedDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [explanationOpen, setExplanationOpen] = useState(false)
  const [explanationType, setExplanationType] = useState<'credits' | 'prediction' | 'team' | 'match'>('prediction')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      } else {
        setUser(session.user)
      }
    }
    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setError('')

      const text = await file.text()
      const matchData = JSON.parse(text)

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      })

      if (!response.ok) {
        throw new Error('Failed to get predictions')
      }

      const data = await response.json()
      setPrediction(data)
    } catch (err: any) {
      setError(err.message || 'Failed to process match file')
    } finally {
      setLoading(false)
    }
  }

  const exportResults = () => {
    if (!prediction) return

    const dataStr = JSON.stringify(prediction, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `perfect_11_${prediction.match_info.match_id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const openExplanation = (player: Player, type: 'credits' | 'prediction') => {
    setSelectedPlayer(player)
    setExplanationType(type)
    setExplanationOpen(true)
  }

  const renderContent = () => {
    if (currentPage === 'test-submission') {
      return <TestSubmission />
    }

    if (currentPage === 'rules') {
      return <RulesSection />
    }

    if (currentPage === 'history') {
      return (
        <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20 text-center">
          <History className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Upload History</h2>
          <p className="text-purple-300">Your previous predictions will appear here</p>
        </div>
      )
    }

    if (currentPage === 'account') {
      return (
        <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Account Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-purple-300 text-sm">Email</label>
              <div className="text-white font-semibold">{user?.email}</div>
            </div>
            <div>
              <label className="text-purple-300 text-sm">Account Type</label>
              <div className="text-white font-semibold">Premium</div>
            </div>
            <div>
              <label className="text-purple-300 text-sm">Member Since</label>
              <div className="text-white font-semibold">
                {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Dashboard content
    if (!prediction) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[600px]"
        >
          <div className="w-full max-w-2xl bg-purple-900/30 backdrop-blur-lg rounded-2xl shadow-2xl p-12 border border-purple-500/20 text-center relative overflow-hidden">
            {/* 3D Cricket Ball Background */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <CricketBall3D />
            </div>

            <Trophy className="w-20 h-20 text-purple-400 mx-auto mb-6 relative z-10" />
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Upload Match Data</h2>
            <p className="text-purple-300 mb-8 relative z-10">
              Upload a match JSON file to get AI-powered team predictions with detailed explanations
            </p>

            <label className="cursor-pointer relative z-10">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
              <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300">
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Choose Match File</span>
                  </>
                )}
              </div>
            </label>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"
              >
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>
      )
    }

    // Results view
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Match Info Header */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16">
                <CricketBall3D />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {prediction.match_info.team1} vs {prediction.match_info.team2}
                </h2>
                <p className="text-purple-300 flex items-center space-x-2">
                  <span>{prediction.match_info.venue}</span>
                  <span>•</span>
                  <span>{prediction.match_info.match_date}</span>
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setExplanationType('match')
                  setExplanationOpen(true)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600/50 hover:bg-purple-600 rounded-lg text-white transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>Match Context</span>
              </button>
              <button
                onClick={exportResults}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setPrediction(null)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 rounded-lg text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Match</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30"
          >
            <div className="text-purple-300 text-sm mb-2 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Total Credits Used</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {prediction.budget_info.total_credits_used.toFixed(2)}
              <span className="text-lg text-purple-400"> / 100</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30"
          >
            <div className="text-pink-300 text-sm mb-2 flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Predicted Fantasy Points</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {prediction.predictions_summary.total_predicted_fp.toFixed(0)}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30"
          >
            <div className="text-indigo-300 text-sm mb-2">Average FP per Player</div>
            <div className="text-3xl font-bold text-white">
              {prediction.predictions_summary.average_predicted_fp.toFixed(0)}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-violet-900/50 to-violet-800/30 backdrop-blur-lg rounded-xl p-6 border border-violet-500/30 cursor-pointer"
            onClick={() => {
              setExplanationType('team')
              setExplanationOpen(true)
            }}
          >
            <div className="text-violet-300 text-sm mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Team Strategy</span>
            </div>
            <div className="text-sm text-white font-semibold">
              Click to see AI explanation
            </div>
          </motion.div>
        </div>

        {/* Cricket Field Visualization */}
        <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Perfect XI</h3>
          <CricketField players={prediction.recommended_xi} />
        </div>

        {/* Player Cards with Attribution */}
        <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Player Analysis with AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prediction.recommended_xi.slice(0, 6).map((player) => (
              <motion.div
                key={player.player_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/20 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-bold">{player.player_name}</div>
                    <div className="text-purple-300 text-sm">{player.team} • {player.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{player.predicted_fp.toFixed(1)} FP</div>
                    <div className="text-purple-400 text-sm">{player.credits} Cr</div>
                  </div>
                </div>

                {player.attribution?.top_features && player.attribution.top_features.length > 0 && (
                  <AttributionChart player={player} compact />
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => openExplanation(player, 'prediction')}
                    className="flex-1 px-3 py-2 bg-purple-600/50 hover:bg-purple-600 rounded text-white text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Why picked?</span>
                  </button>
                  <button
                    onClick={() => openExplanation(player, 'credits')}
                    className="flex-1 px-3 py-2 bg-pink-600/50 hover:bg-pink-600 rounded text-white text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <Calculator className="w-3 h-3" />
                    <span>Credits math</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Full Player Table */}
        <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Complete Team Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left py-3 px-4 text-purple-300 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-semibold">Player</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-semibold">Team</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-semibold">Credits</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-semibold">Predicted FP</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prediction.recommended_xi.map((player) => (
                  <tr key={player.player_id} className="border-b border-purple-500/10 hover:bg-purple-800/20">
                    <td className="py-3 px-4 text-white font-bold">{player.rank}</td>
                    <td className="py-3 px-4 text-white">{player.player_name}</td>
                    <td className="py-3 px-4 text-purple-300">{player.team}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-600/50 rounded text-white text-sm">
                        {player.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">{player.credits}</td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {player.predicted_fp.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openExplanation(player, 'prediction')}
                        className="text-purple-400 hover:text-purple-300 text-sm underline"
                      >
                        Explain
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onSignOut={handleSignOut}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Explanation Modal */}
      <ExplanationPanel
        isOpen={explanationOpen}
        onClose={() => setExplanationOpen(false)}
        player={selectedPlayer}
        explanationType={explanationType}
        data={{
          match_info: prediction?.match_info,
          venue: prediction?.match_info.venue,
          selected_xi: prediction?.recommended_xi,
          budget_info: prediction?.budget_info
        }}
      />
    </div>
  )
}
