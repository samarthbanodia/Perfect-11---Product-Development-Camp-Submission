'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface Player {
  rank: number
  player_name: string
  team: string
  role: string
  predicted_fp: number
  credits: number
}

interface CricketFieldProps {
  players: Player[]
}

export default function CricketField({ players }: CricketFieldProps) {
  // Organize players by role
  const wicketKeepers = players.filter(p => p.role === 'WK')
  const batters = players.filter(p => p.role === 'BAT')
  const allRounders = players.filter(p => p.role === 'AR')
  const bowlers = players.filter(p => p.role === 'BOWL')

  const PlayerCard = ({ player, index }: { player: Player; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      className="flex flex-col items-center space-y-2 cursor-pointer"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg ring-4 ring-purple-400/30">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-purple-900">
          {player.rank}
        </div>
      </div>
      <div className="bg-purple-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-center min-w-[120px]">
        <div className="text-white font-semibold text-sm truncate max-w-[110px]">
          {player.player_name}
        </div>
        <div className="text-purple-300 text-xs">{player.credits} Cr</div>
      </div>
    </motion.div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl field-glow">
        {/* Cricket field background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-700">
          {/* Field markings */}
          <div className="absolute inset-0">
            {/* Outer circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border-4 border-white/20" />
            {/* Inner circle (pitch area) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[20%] h-[60%] bg-yellow-100/10 rounded-lg border-2 border-white/30" />
            {/* Center line */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-white/10" />
          </div>

          {/* Players positioned on field */}
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            {/* Wicket-keepers (bottom) */}
            <div className="flex justify-center mt-auto mb-8">
              <div className="flex space-x-6">
                {wicketKeepers.map((player, idx) => (
                  <PlayerCard key={player.player_name} player={player} index={idx} />
                ))}
              </div>
            </div>

            {/* Batters (lower middle) */}
            <div className="flex justify-center space-x-8 mt-2">
              {batters.map((player, idx) => (
                <PlayerCard key={player.player_name} player={player} index={wicketKeepers.length + idx} />
              ))}
            </div>

            {/* All-rounders (middle) */}
            <div className="flex justify-center space-x-12 mt-2">
              {allRounders.map((player, idx) => (
                <PlayerCard key={player.player_name} player={player} index={wicketKeepers.length + batters.length + idx} />
              ))}
            </div>

            {/* Bowlers (top) */}
            <div className="flex justify-center space-x-8 mb-auto mt-2">
              {bowlers.map((player, idx) => (
                <PlayerCard
                  key={player.player_name}
                  player={player}
                  index={wicketKeepers.length + batters.length + allRounders.length + idx}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Legend */}
      <div className="mt-6 flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-purple-300">WK: {wicketKeepers.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-pink-500" />
          <span className="text-purple-300">BAT: {batters.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-purple-300">AR: {allRounders.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-purple-300">BOWL: {bowlers.length}</span>
        </div>
      </div>
    </div>
  )
}
