'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileCheck, AlertCircle, Download, ChevronDown, ChevronRight } from 'lucide-react'

interface TestSubmissionProps {
  onClose?: () => void
}

export default function TestSubmission({ onClose }: TestSubmissionProps) {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles(selectedFiles)
    setResults([])
  }

  const handleBatchUpload = async () => {
    if (files.length === 0) return

    setLoading(true)
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('http://localhost:5000/batch_predict', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Batch upload failed:', error)
      alert('Failed to process batch upload')
    } finally {
      setLoading(false)
    }
  }

  const downloadEvalCSV = async () => {
    try {
      // Format results for CSV export - use actual data from batch results
      const csvData = results
        .filter(r => r.status === 'success')
        .map(r => ({
          match_id: r.match_id,
          match_date: r.match_date,
          team1: r.team1,
          team2: r.team2,
          predicted_xi: Array.isArray(r.predicted_xi) ? r.predicted_xi.join(',') : '',
          dream_xi: Array.isArray(r.dream_xi) ? r.dream_xi.join(',') : '',
          predicted_points_per_player: r.predicted_xi_fp || '',
          ae_team_total: r.ae_team_total || 0
        }))

      const response = await fetch('http://localhost:5000/export_eval_csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results: csvData }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'eval_summary.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download CSV:', error)
      alert('Failed to download evaluation summary')
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">Batch Test Submission</h2>
        <p className="text-purple-300 mb-6">
          Upload multiple match JSON files for batch processing and evaluation
        </p>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".json"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-8 hover:border-purple-400 hover:bg-purple-900/20 transition-all duration-300">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-12 h-12 text-purple-400" />
              <div className="text-center">
                <div className="text-white font-semibold">
                  Click to upload match JSON files
                </div>
                <div className="text-purple-400 text-sm mt-1">
                  or drag and drop multiple files
                </div>
              </div>
            </div>
          </div>
        </label>

        {files.length > 0 && (
          <div className="mt-4">
            <div className="text-white font-semibold mb-2">
              Selected: {files.length} file(s)
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {files.map((file, idx) => (
                <div key={idx} className="text-sm text-purple-300 flex items-center space-x-2">
                  <FileCheck className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleBatchUpload}
              disabled={loading}
              className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Process ${files.length} Match(es)`}
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              Batch Results ({results.filter(r => r.status === 'success').length}/{results.length} successful)
            </h3>
            <button
              onClick={downloadEvalCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download eval_summary.csv</span>
            </button>
          </div>

          {/* Error Metrics Summary */}
          {(() => {
            const successfulResults = results.filter(r => r.status === 'success' && r.ae_team_total !== undefined)
            const totalAE = successfulResults.reduce((sum, r) => sum + (r.ae_team_total || 0), 0)
            const meanAE = successfulResults.length > 0 ? totalAE / successfulResults.length : 0

            return successfulResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-800/40 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-purple-300 text-sm mb-1">Total Matches with Data</div>
                  <div className="text-2xl font-bold text-white">{successfulResults.length}</div>
                </div>
                <div className="bg-purple-800/40 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-purple-300 text-sm mb-1">Mean AE Team Total</div>
                  <div className="text-2xl font-bold text-white">{meanAE.toFixed(2)} FP</div>
                  <div className="text-purple-400 text-xs mt-1">Average error across all matches</div>
                </div>
              </div>
            ) : null
          })()}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-purple-800/30 rounded-lg border border-purple-500/20 overflow-hidden"
              >
                <div
                  onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  className="p-4 cursor-pointer hover:bg-purple-700/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {result.status === 'success' ? (
                        <FileCheck className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <div className="text-white font-semibold">
                          {result.team1} vs {result.team2}
                        </div>
                        <div className="text-purple-300 text-sm">
                          {result.match_date} • Match ID: {result.match_id}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {result.status === 'success' && (
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            {result.total_predicted_fp?.toFixed(0)} FP
                          </div>
                          <div className="text-purple-400 text-sm">
                            {result.total_credits?.toFixed(2)} credits
                          </div>
                          {result.ae_team_total !== undefined && result.ae_team_total > 0 && (
                            <div className="text-pink-400 text-xs mt-1">
                              AE: {result.ae_team_total?.toFixed(2)} FP
                            </div>
                          )}
                        </div>
                      )}
                      {expandedIndex === idx ? (
                        <ChevronDown className="w-5 h-5 text-purple-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-purple-500/20"
                    >
                      <div className="p-4 space-y-2">
                        {result.status === 'success' ? (
                          <>
                            <div className="text-white font-semibold mb-2">Predicted XI:</div>
                            <div className="grid grid-cols-2 gap-2">
                              {result.predicted_xi?.map((player: string, pidx: number) => (
                                <div key={pidx} className="text-sm text-purple-300">
                                  {pidx + 1}. {player}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-red-300 text-sm">
                            Error: {result.error || 'Unknown error'}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
