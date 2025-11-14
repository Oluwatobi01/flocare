'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, Calendar, Activity, BookOpen, Crown } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="h-16 w-16 text-pink-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to FemCare
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your personal health companion for period tracking, pregnancy, and wellness insights
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Calendar className="h-8 w-8 text-pink-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Period Tracking</h3>
                <p className="text-gray-600">Track your cycle, predict ovulation, and understand your body better</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Activity className="h-8 w-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Symptom Monitoring</h3>
                <p className="text-gray-600">Log symptoms and visualize patterns with interactive charts</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Heart className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pregnancy Mode</h3>
                <p className="text-gray-600">Track fetal development and get week-by-week insights</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <BookOpen className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Health Insights</h3>
                <p className="text-gray-600">Get personalized health recommendations and educational content</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-yellow-600">
                <Crown className="h-5 w-5" />
                <span className="font-medium">Premium features available with subscription</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}