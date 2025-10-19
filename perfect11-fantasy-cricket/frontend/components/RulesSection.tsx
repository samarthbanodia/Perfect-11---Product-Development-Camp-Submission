'use client'

import { motion } from 'framer-motion'
import { Info, Users, DollarSign, Calculator, Target, Trophy } from 'lucide-react'

export default function RulesSection() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Info className="w-6 h-6 text-purple-400" />
          <span>Perfect 11 - Rules & Constraints</span>
        </h2>
        <p className="text-purple-300 mb-6">
          All rules and constraints as specified in the Selection Camp Product document
        </p>

        {/* Team Composition Rules */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
            <Users className="w-5 h-5 text-pink-400" />
            <span>Team Composition Constraints</span>
          </h3>
          <div className="bg-purple-800/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Wicket-keepers (WK)</div>
                <div className="text-purple-300 text-sm">Minimum: 1, Maximum: 4</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Batters (BAT)</div>
                <div className="text-purple-300 text-sm">Minimum: 3, Maximum: 6</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">All-rounders (AR)</div>
                <div className="text-purple-300 text-sm">Minimum: 1, Maximum: 4</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Bowlers (BOWL)</div>
                <div className="text-purple-300 text-sm">Minimum: 3, Maximum: 6</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Total Players</div>
                <div className="text-purple-300 text-sm">Exactly 11 players</div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Rules */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span>Budget & Credits</span>
          </h3>
          <div className="bg-purple-800/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Total Budget</div>
                <div className="text-purple-300 text-sm">Maximum 100 credits for the entire team</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Credit Range</div>
                <div className="text-purple-300 text-sm">Each player: 4.00 - 11.00 credits</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Max from One Team</div>
                <div className="text-purple-300 text-sm">Maximum 7 players from a single team</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <div className="text-white font-semibold">Both Teams Required</div>
                <div className="text-purple-300 text-sm">At least one player from each competing team</div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits Calculation */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-yellow-400" />
            <span>Credits Calculation Formula</span>
          </h3>
          <div className="bg-purple-800/30 rounded-lg p-4 space-y-4">
            <div className="font-mono text-sm bg-purple-900/50 p-3 rounded border border-purple-500/30">
              <div className="text-purple-300 mb-2">Step 1: Composite Score</div>
              <div className="text-white">
                Composite Score = 0.7 × μ_FP_10 + 0.3 × (μ_FP_10 - σ_FP_10)
              </div>
            </div>
            <div className="text-purple-300 text-sm">
              Where:
              <ul className="ml-4 mt-2 space-y-1">
                <li>• μ_FP_10 = Mean fantasy points over last 10 matches</li>
                <li>• σ_FP_10 = Standard deviation of fantasy points</li>
              </ul>
            </div>
            <div className="font-mono text-sm bg-purple-900/50 p-3 rounded border border-purple-500/30">
              <div className="text-purple-300 mb-2">Step 2: Percentile Ranking</div>
              <div className="text-white text-xs">
                Player ranked within their role (BAT, BOWL, AR, WK)
              </div>
            </div>
            <div className="font-mono text-sm bg-purple-900/50 p-3 rounded border border-purple-500/30">
              <div className="text-purple-300 mb-2">Step 3: Credit Bands</div>
              <div className="text-white text-xs space-y-1">
                <div>• Top 10%: 10.5 - 11.0 credits</div>
                <div>• Next 20%: 9.0 - 10.0 credits</div>
                <div>• Middle 40%: 7.0 - 8.5 credits</div>
                <div>• Bottom 30%: 4.0 - 6.5 credits</div>
              </div>
            </div>
            <div className="text-purple-300 text-sm">
              <strong className="text-white">Newcomer Clamp:</strong> Players with &lt;10 matches get role_median ± 0.5 credits
            </div>
          </div>
        </div>

        {/* Scoring System */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
            <Target className="w-5 h-5 text-orange-400" />
            <span>Fantasy Points Scoring</span>
          </h3>
          <div className="bg-purple-800/30 rounded-lg p-4 space-y-3">
            <div>
              <div className="text-white font-semibold mb-2">Batting</div>
              <div className="text-sm text-purple-300 space-y-1">
                <div>• 1 run = 1 point</div>
                <div>• Boundary (4) = +1 bonus</div>
                <div>• Six (6) = +2 bonus</div>
                <div>• Half-century (50) = +8 bonus</div>
                <div>• Century (100) = +16 bonus</div>
                <div>• Duck (out for 0) = -2 penalty</div>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-2">Bowling</div>
              <div className="text-sm text-purple-300 space-y-1">
                <div>• Wicket = 25 points</div>
                <div>• 4 wickets = +8 bonus</div>
                <div>• 5 wickets = +16 bonus</div>
                <div>• Maiden over = 12 points</div>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-2">Fielding</div>
              <div className="text-sm text-purple-300 space-y-1">
                <div>• Catch = 8 points</div>
                <div>• Stumping = 12 points</div>
                <div>• Run out = 6 points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Metric */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span>Evaluation Metric</span>
          </h3>
          <div className="bg-purple-800/30 rounded-lg p-4 space-y-3">
            <div className="font-mono text-sm bg-purple-900/50 p-3 rounded border border-purple-500/30">
              <div className="text-purple-300 mb-2">AE Team Total (Absolute Error)</div>
              <div className="text-white">
                ae_team_total = |Dream XI Total FP - Predicted XI Total FP|
              </div>
            </div>
            <div className="text-purple-300 text-sm">
              <strong className="text-white">Dream XI:</strong> Best possible 11 players based on actual fantasy points scored in the match
            </div>
            <div className="text-purple-300 text-sm">
              <strong className="text-white">Predicted XI:</strong> Our model's recommended 11 players before the match
            </div>
            <div className="text-purple-300 text-sm">
              Lower ae_team_total = Better prediction accuracy
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30"
      >
        <h3 className="text-lg font-semibold text-white mb-2">💡 Pro Tip</h3>
        <p className="text-purple-300 text-sm">
          Our ML model uses Linear Programming to find the optimal team that maximizes predicted fantasy points
          while satisfying all constraints. The model considers historical performance, recent form, venue statistics,
          and opponent matchups.
        </p>
      </motion.div>
    </div>
  )
}
