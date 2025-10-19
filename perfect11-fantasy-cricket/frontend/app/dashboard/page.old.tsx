'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import CricketField from '@/components/CricketField'
import { Upload, LogOut, RefreshCw, Download, Trophy, TrendingUp } from 'lucide-react'

interface Player {
  rank: number
  player_id: string
  player_name: string
  team: string
  role: string
  predicted_fp: number
  credits: number
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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState('')

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
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/perfect_11_logo.png"
              alt="Perfect 11"
              width={60}
              height={60}
            />
            <h1 className="text-3xl font-bold text-white">Perfect 11</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-purple-900/50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-white">{user.email}</span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 rounded-lg text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {!prediction ? (
          /* Upload Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[600px]"
          >
            <div className="w-full max-w-2xl bg-purple-900/30 backdrop-blur-lg rounded-2xl shadow-2xl p-12 border border-purple-500/20 text-center">
              <Trophy className="w-20 h-20 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Upload Match Data</h2>
              <p className="text-purple-300 mb-8">
                Upload a match JSON file to get AI-powered team predictions
              </p>

              <label className="cursor-pointer">
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

              <div className="mt-12 grid grid-cols-3 gap-8 text-sm">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-white font-semibold">Upload</div>
                  <div className="text-purple-400 text-xs">Match JSON</div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-white font-semibold">Analyze</div>
                  <div className="text-purple-400 text-xs">AI Prediction</div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-white font-semibold">Build</div>
                  <div className="text-purple-400 text-xs">Perfect 11</div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Results Section */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Match Info */}
            <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {prediction.match_info.team1} vs {prediction.match_info.team2}
                  </h2>
                  <p className="text-purple-300">
                    {prediction.match_info.venue} • {prediction.match_info.match_date}
                  </p>
                </div>
                <div className="flex space-x-2">
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <div className="text-purple-300 text-sm mb-2">Total Credits Used</div>
                <div className="text-3xl font-bold text-white">
                  {prediction.budget_info.total_credits_used.toFixed(2)}
                  <span className="text-lg text-purple-400"> / 100</span>
                </div>
              </div>
              <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <div className="text-purple-300 text-sm mb-2">Predicted Fantasy Points</div>
                <div className="text-3xl font-bold text-white">
                  {prediction.predictions_summary.total_predicted_fp.toFixed(0)}
                </div>
              </div>
              <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <div className="text-purple-300 text-sm mb-2">Average FP per Player</div>
                <div className="text-3xl font-bold text-white">
                  {prediction.predictions_summary.average_predicted_fp.toFixed(0)}
                </div>
              </div>
            </div>

            {/* Cricket Field Visualization */}
            <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Perfect XI</h3>
              <CricketField players={prediction.recommended_xi} />
            </div>

            {/* Player Details Table */}
            <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Player Details</h3>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
