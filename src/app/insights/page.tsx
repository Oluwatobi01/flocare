'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen,
  Heart,
  Calendar,
  Activity,
  Star,
  Info
} from 'lucide-react'

interface HealthInsight {
  id: string
  type: string
  title: string
  content: string
  severity?: string
  isRead: boolean
  createdAt: Date
}

interface EducationalContent {
  id: string
  title: string
  content: string
  category: string
  targetAudience: string
  tags: string[]
  isPremium: boolean
}

export default function InsightsPage() {
  const { user } = useAuth()
  const [insights, setInsights] = useState<HealthInsight[]>([])
  const [educationalContent, setEducationalContent] = useState<EducationalContent[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockInsights: HealthInsight[] = [
      {
        id: '1',
        type: 'cycle_irregularity',
        title: 'Cycle Length Variation Detected',
        content: 'Your cycle length has varied by more than 5 days over the last 3 months. This could be normal, but consider tracking stress levels, sleep patterns, and diet. If irregularities persist, consult with your healthcare provider.',
        severity: 'medium',
        isRead: false,
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'symptom_pattern',
        title: 'Headache Pattern Before Period',
        content: 'We\'ve noticed you frequently report headaches 2-3 days before your period starts. This is common and may be related to hormonal changes. Consider staying hydrated and getting adequate rest during this time.',
        severity: 'low',
        isRead: false,
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: '3',
        type: 'health_tip',
        title: 'Improve Sleep Quality',
        content: 'Your sleep quality has been rated as "fair" or "poor" for 4 out of the last 7 days. Good sleep is crucial for hormonal balance. Try establishing a consistent bedtime routine and avoiding screens 1 hour before bed.',
        severity: 'low',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        id: '4',
        type: 'cycle_irregularity',
        title: 'Missed Period Alert',
        content: 'Based on your average cycle length, your period is 10 days late. If you\'re sexually active, consider taking a pregnancy test. Other factors like stress, travel, or illness can also affect your cycle.',
        severity: 'high',
        isRead: false,
        createdAt: new Date(Date.now() - 259200000)
      }
    ]

    const mockEducationalContent: EducationalContent[] = [
      {
        id: '1',
        title: 'Understanding Your Menstrual Cycle',
        content: 'The menstrual cycle is a complex process involving hormones that prepare your body for pregnancy each month. A typical cycle lasts 21-35 days, with bleeding lasting 2-7 days. The cycle has four phases: menstruation, follicular phase, ovulation, and luteal phase. Understanding your cycle can help you recognize what\'s normal for your body and identify potential issues early.',
        category: 'menstruation',
        targetAudience: 'all',
        tags: ['cycle', 'hormones', 'education'],
        isPremium: false
      },
      {
        id: '2',
        title: 'Nutrition for Hormonal Balance',
        content: 'A balanced diet plays a crucial role in maintaining hormonal health. Focus on whole foods rich in iron, calcium, and B vitamins. Include plenty of fruits, vegetables, lean proteins, and healthy fats. Foods rich in omega-3 fatty acids like salmon, chia seeds, and walnuts can help reduce inflammation and menstrual pain. Limit processed foods, excess sugar, and caffeine, which can disrupt hormonal balance.',
        category: 'general_health',
        targetAudience: 'all',
        tags: ['nutrition', 'diet', 'hormones'],
        isPremium: false
      },
      {
        id: '3',
        title: 'Tracking Fertility Signs',
        content: 'Understanding your fertility signs can help you identify your most fertile days. Key signs include basal body temperature changes, cervical mucus consistency, and cervical position. Your basal body temperature typically rises slightly after ovulation. Cervical mucus becomes clear, stretchy, and similar to egg whites during fertile periods. Tracking these signs consistently can help you understand your cycle better.',
        category: 'fertility',
        targetAudience: 'trying_to_conceive',
        tags: ['fertility', 'ovulation', 'tracking'],
        isPremium: true
      },
      {
        id: '4',
        title: 'Managing PMS Symptoms',
        content: 'Premenstrual syndrome (PMS) affects many women and can cause physical and emotional symptoms. Common strategies to manage PMS include regular exercise, stress reduction techniques like yoga or meditation, adequate sleep, and dietary modifications. Consider reducing salt intake to minimize bloating, and increase complex carbohydrates to stabilize mood. Some women find relief through calcium, magnesium, or vitamin B6 supplements.',
        category: 'menstruation',
        targetAudience: 'regular_cycle',
        tags: ['PMS', 'symptoms', 'management'],
        isPremium: false
      },
      {
        id: '5',
        title: 'First Trimester Essentials',
        content: 'The first trimester (weeks 1-12) is crucial for your baby\'s development. Key focus areas include taking prenatal vitamins with folic acid, avoiding alcohol and smoking, eating a balanced diet, and getting regular prenatal care. Common symptoms include morning sickness, fatigue, and breast tenderness. Stay hydrated and eat small, frequent meals to manage nausea. Contact your healthcare provider if you experience severe symptoms or concerns.',
        category: 'pregnancy',
        targetAudience: 'pregnant',
        tags: ['pregnancy', 'first trimester', 'prenatal care'],
        isPremium: true
      },
      {
        id: '6',
        title: 'Exercise During Your Cycle',
        content: 'Exercise can help manage menstrual symptoms and improve overall health. During your period, gentle activities like walking, yoga, or swimming can help reduce cramps. In the follicular phase, you may have more energy for higher intensity workouts. Around ovulation, many women feel their strongest. In the luteal phase, consider moderate exercise as high intensity may increase PMS symptoms. Listen to your body and adjust your routine accordingly.',
        category: 'general_health',
        targetAudience: 'all',
        tags: ['exercise', 'fitness', 'cycle'],
        isPremium: false
      }
    ]

    setInsights(mockInsights)
    setEducationalContent(mockEducationalContent)
  }, [])

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'high': return AlertTriangle
      case 'medium': return Info
      case 'low': return CheckCircle
      default: return Lightbulb
    }
  }

  const unreadInsights = insights.filter(i => !i.isRead)
  const highSeverityInsights = insights.filter(i => i.severity === 'high')

  const markAsRead = (insightId: string) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, isRead: true }
          : insight
      )
    )
  }

  const getContentByCategory = (category: string) => {
    return educationalContent.filter(content => content.category === category)
  }

  const getPremiumContent = () => {
    return educationalContent.filter(content => content.isPremium)
  }

  const getFreeContent = () => {
    return educationalContent.filter(content => !content.isPremium)
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Insights</h1>
            <p className="text-gray-600 mt-1">Personalized health recommendations and educational content</p>
          </div>
          <Button variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            View All Articles
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Insights</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadInsights.length}</div>
              <p className="text-xs text-muted-foreground">
                New recommendations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highSeverityInsights.length}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-muted-foreground">
                Good progress
              </p>
            </CardContent>
          </Card>
        </div>

        {highSeverityInsights.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You have {highSeverityInsights.length} high-priority insight{highSeverityInsights.length > 1 ? 's' : ''} that require your attention.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList>
            <TabsTrigger value="insights">Your Insights</TabsTrigger>
            <TabsTrigger value="education">Educational Content</TabsTrigger>
            <TabsTrigger value="premium">Premium Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <div className="space-y-4">
              {insights.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Insights Yet</h3>
                    <p className="text-gray-600">Start tracking your periods and symptoms to receive personalized health insights</p>
                  </CardContent>
                </Card>
              ) : (
                [...insights]
                  .sort((a, b) => {
                    // Sort by unread first, then by severity, then by date
                    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1
                    const severityOrder = { high: 0, medium: 1, low: 2 }
                    const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] ?? 3
                    const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] ?? 3
                    if (aSeverity !== bSeverity) return aSeverity - bSeverity
                    return b.createdAt.getTime() - a.createdAt.getTime()
                  })
                  .map((insight) => {
                    const Icon = getSeverityIcon(insight.severity)
                    return (
                      <Card key={insight.id} className={!insight.isRead ? 'border-l-4 border-l-pink-500' : ''}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${getSeverityColor(insight.severity)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                                <div className="flex items-center gap-2">
                                  {!insight.isRead && (
                                    <Badge variant="secondary">New</Badge>
                                  )}
                                  <Badge className={getSeverityColor(insight.severity)}>
                                    {insight.severity || 'info'}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-3">{insight.content}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {format(insight.createdAt, 'MMM dd, yyyy')}
                                </span>
                                {!insight.isRead && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => markAsRead(insight.id)}
                                  >
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
              )}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid md:grid-cols-2 gap-6">
              {getFreeContent().map((content) => (
                <Card key={content.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <Badge variant="outline">Free</Badge>
                    </div>
                    <CardDescription>
                      {content.category.charAt(0).toUpperCase() + content.category.slice(1).replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{content.content}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {content.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="premium">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Content</h3>
                      <p className="text-gray-600">Get access to expert-written articles and advanced health insights</p>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Upgrade to Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {getPremiumContent().map((content) => (
                  <Card key={content.id} className="relative">
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <CardHeader className="pr-16">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        {content.category.charAt(0).toUpperCase() + content.category.slice(1).replace('_', ' ')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{content.content}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {content.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <Star className="h-3 w-3 mr-1" />
                        Premium Only
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}

function format(date: Date, formatString: string): string {
  // Simple date formatting function
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return date.toLocaleDateString('en-US', options)
}