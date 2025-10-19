'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'

interface AttributionChartProps {
  player: any
  compact?: boolean
}

export default function AttributionChart({ player, compact = false }: AttributionChartProps) {
  const topFeatures = player.attribution?.top_features || []

  if (topFeatures.length === 0) {
    return (
      <div className="text-purple-400 text-sm text-center py-4">
        No attribution data available
      </div>
    )
  }

  // Format data for chart
  const chartData = topFeatures.slice(0, compact ? 3 : 5).map((feat: any) => ({
    name: interpretFeatureName(feat.feature),
    value: feat.importance,
    fullName: feat.feature
  }))

  const maxAbsValue = Math.max(...chartData.map((d: any) => Math.abs(d.value)))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-purple-900/30 rounded-lg p-${compact ? '3' : '4'} border border-purple-500/20`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>
          Feature Importance (SHAP)
        </h4>
        <div className={`px-2 py-1 rounded ${compact ? 'text-xs' : 'text-sm'} bg-purple-700/50 text-purple-200`}>
          ML Explainability
        </div>
      </div>

      <ResponsiveContainer width="100%" height={compact ? 150 : 250}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#8b5cf6" opacity={0.1} />
          <XAxis
            type="number"
            stroke="#a78bfa"
            tick={{ fill: '#c4b5fd', fontSize: compact ? 10 : 12 }}
            domain={[-maxAbsValue * 1.1, maxAbsValue * 1.1]}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#a78bfa"
            tick={{ fill: '#c4b5fd', fontSize: compact ? 10 : 12 }}
            width={compact ? 80 : 120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e1b4b',
              border: '1px solid #8b5cf6',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelStyle={{ color: '#c4b5fd' }}
            formatter={(value: number) => [value.toFixed(2), 'Impact']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value > 0 ? '#10b981' : '#ef4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {!compact && (
        <div className="mt-4 space-y-2">
          <div className="text-xs text-purple-400 font-semibold">Impact Breakdown:</div>
          {chartData.map((feat: any, idx: number) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${feat.value > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-purple-300 flex-1">{feat.name}</span>
              <span className={`text-xs font-mono ${feat.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {feat.value > 0 ? '+' : ''}{feat.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-3 ${compact ? 'text-xs' : 'text-sm'} text-purple-300`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Positive Impact</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span>Negative Impact</span>
          </div>
        </div>
        <div className="text-xs text-purple-400 mt-2">
          SHAP values explain how each feature contributes to the predicted fantasy points
        </div>
      </div>
    </motion.div>
  )
}

function interpretFeatureName(feature: string): string {
  const featureMap: Record<string, string> = {
    'avg_fp': 'Avg FP',
    'std_fp': 'Consistency',
    'recent_form_3': 'Recent Form (3)',
    'recent_form_5': 'Recent Form (5)',
    'avg_fp_last10': 'Last 10 Avg',
    'venue_avg_fp': 'Venue Perf',
    'opp_avg_fp': 'vs Opponent',
    'avg_runs': 'Avg Runs',
    'avg_wickets': 'Avg Wickets',
    'avg_catches': 'Avg Catches',
    'num_matches': 'Experience',
    'team_encoded': 'Team Factor',
    'opponent_encoded': 'Opp Strength',
    'venue_encoded': 'Venue Factor',
    'role_encoded': 'Role Spec'
  }

  return featureMap[feature] || feature.replace('_', ' ').slice(0, 15)
}
