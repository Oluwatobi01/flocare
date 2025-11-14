'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Crown, 
  Check, 
  Star, 
  Heart, 
  Calendar, 
  Activity, 
  Baby, 
  BookOpen,
  TrendingUp,
  Shield,
  Users
} from 'lucide-react'

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)

  const plans = {
    monthly: {
      price: '$9.99',
      period: 'per month',
      yearlyEquivalent: '$119.88/year'
    },
    yearly: {
      price: '$79.99',
      period: 'per year',
      savings: 'Save $39.89',
      monthlyEquivalent: '$6.67/month'
    }
  }

  const features = [
    {
      icon: Calendar,
      title: 'Advanced Period Tracking',
      description: 'Detailed cycle analysis with predictions and pattern recognition',
      included: true
    },
    {
      icon: Activity,
      title: 'Symptom Analytics',
      description: 'Advanced charts and correlations between symptoms and cycle phases',
      included: true
    },
    {
      icon: Baby,
      title: 'Pregnancy Insights',
      description: 'Week-by-week development tracking and personalized recommendations',
      included: true
    },
    {
      icon: BookOpen,
      title: 'Premium Educational Content',
      description: 'Access to expert-written articles and guides',
      included: true
    },
    {
      icon: TrendingUp,
      title: 'Health Score & Trends',
      description: 'Comprehensive health scoring with improvement recommendations',
      included: true
    },
    {
      icon: Shield,
      title: 'Data Privacy & Security',
      description: 'Enhanced privacy controls and data export options',
      included: true
    },
    {
      icon: Users,
      title: 'Priority Support',
      description: 'Get faster responses from our healthcare team',
      included: true
    }
  ]

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would create a Stripe checkout session
      console.log('Subscribing to plan:', selectedPlan)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Subscription successful! Welcome to Premium!')
      setIsUpgradeDialogOpen(false)
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Subscription failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const freeFeatures = [
    'Basic period tracking',
    'Limited symptom logging',
    'Standard calendar view',
    'Basic educational articles',
    'Community support'
  ]

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to advanced features, personalized insights, and expert content
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Basic tracking features</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-purple-200 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="pt-6">
              <CardTitle className="text-xl flex items-center gap-2">
                Premium
                <Crown className="h-5 w-5 text-yellow-500" />
              </CardTitle>
              <CardDescription>Complete health tracking experience</CardDescription>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{plans[selectedPlan].price}</span>
                  <span className="text-gray-600">{plans[selectedPlan].period}</span>
                </div>
                {selectedPlan === 'yearly' && (
                  <div className="text-sm text-green-600 font-medium">{plans.yearly.savings}</div>
                )}
                {selectedPlan === 'monthly' && (
                  <div className="text-sm text-gray-500">{plans.monthly.yearlyEquivalent}</div>
                )}
                {selectedPlan === 'yearly' && (
                  <div className="text-sm text-gray-500">{plans.yearly.monthlyEquivalent}</div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlan('monthly')}
                  className="flex-1"
                >
                  Monthly
                </Button>
                <Button
                  variant={selectedPlan === 'yearly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlan('yearly')}
                  className="flex-1"
                >
                  Yearly (Save 33%)
                </Button>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{feature.title}</div>
                        <div className="text-xs text-gray-600">{feature.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Upgrade to Premium
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Premium Subscription</DialogTitle>
                    <DialogDescription>
                      You're about to subscribe to FemCare Premium {plans[selectedPlan].period}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>Plan:</span>
                        <span className="font-medium">Premium ({selectedPlan})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Price:</span>
                        <span className="font-bold text-lg">{plans[selectedPlan].price}</span>
                      </div>
                    </div>
                    
                    <Alert>
                      <Star className="h-4 w-4" />
                      <AlertDescription>
                        Your subscription will auto-renew. You can cancel anytime from your account settings.
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsUpgradeDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {loading ? 'Processing...' : 'Confirm Subscription'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>What Premium Users Say</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    "The symptom tracking and insights have helped me understand my body so much better!"
                  </p>
                  <p className="text-xs text-gray-500 font-medium">- Sarah K.</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    "The pregnancy tracking features are amazing. Love the week-by-week updates!"
                  </p>
                  <p className="text-xs text-gray-500 font-medium">- Emily R.</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    "Worth every penny. The health insights helped me identify issues I didn't know about."
                  </p>
                  <p className="text-xs text-gray-500 font-medium">- Jessica M.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">30-Day Money Back Guarantee</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Try Premium risk-free. If you're not completely satisfied, contact us within 30 days for a full refund.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}