'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { User, History, FileCheck, Settings, LogOut, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface SidebarProps {
  user: any
  currentPage: string
  onNavigate: (page: string) => void
  onSignOut: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({
  user,
  currentPage,
  onNavigate,
  onSignOut,
  collapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: History,
      description: 'Main dashboard'
    },
    {
      id: 'history',
      label: 'Previous Uploads',
      icon: History,
      description: 'View upload history'
    },
    {
      id: 'test-submission',
      label: 'Test Submission',
      icon: FileCheck,
      description: 'Batch upload matches'
    },
    {
      id: 'rules',
      label: 'Rules & Scoring',
      icon: BookOpen,
      description: 'View all rules and constraints'
    },
    {
      id: 'account',
      label: 'Account Details',
      icon: Settings,
      description: 'Manage your account'
    }
  ]

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      className="h-screen bg-gradient-to-b from-purple-950 to-purple-900 border-r border-purple-500/20 flex flex-col sticky top-0"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <Image
              src="/perfect_11_logo.png"
              alt="Perfect 11"
              width={40}
              height={40}
            />
            <div>
              <h2 className="text-white font-bold text-lg">Perfect 11</h2>
              <p className="text-purple-300 text-xs">AI Team Builder</p>
            </div>
          </motion.div>
        )}

        {collapsed && (
          <Image
            src="/perfect_11_logo.png"
            alt="Perfect 11"
            width={40}
            height={40}
            className="mx-auto"
          />
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-purple-500/20">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm truncate">
                {user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-purple-400 text-xs truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-purple-300 hover:bg-purple-800/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                  {isActive && (
                    <div className="text-xs opacity-75">{item.description}</div>
                  )}
                </div>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-purple-500/20">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </motion.div>
  )
}
