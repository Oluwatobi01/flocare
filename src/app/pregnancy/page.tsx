'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Baby, 
  Calendar, 
  Plus, 
  Heart, 
  Activity, 
  Ruler, 
  Weight,
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { format, addDays, differenceInWeeks, differenceInDays } from 'date-fns'

interface Pregnancy {
  id: string
  startDate: Date
  dueDate: Date
  currentWeek: number
  isCurrent: boolean
  notes?: string
}

interface PregnancyUpdate {
  id: string
  pregnancyId: string
  week: number
  weight?: number
  symptoms?: string
  notes?: string
}

interface FetalDevelopment {
  week: number
  size: string
  weight: string
  developments: string[]
  tips: string[]
}

const fetalDevelopmentData: FetalDevelopment[] = [
  {
    week: 1,
    size: "Poppy seed",
    weight: "0.0 oz",
    developments: ["Conception occurs", "Fertilized egg implants in uterus"],
    tips: ["Start taking prenatal vitamins", "Maintain healthy lifestyle"]
  },
  {
    week: 8,
    size: "Kidney bean",
    weight: "0.1 oz",
    developments: ["Major organs forming", "Fingers and toes appear", "Heart beating"],
    tips: ["Schedule first prenatal visit", "Stay hydrated"]
  },
  {
    week: 12,
    size: "Lime",
    weight: "0.5 oz",
    developments: ["All organs formed", "Fingers and toes separated", "Can make fists"],
    tips: ["Consider announcing pregnancy", "Start pregnancy exercises"]
  },
  {
    week: 16,
    size: "Avocado",
    weight: "3.5 oz",
    developments: ["Skeleton hardening", "Can hear sounds", "Facial muscles developing"],
    tips: ["Feel first movements soon", "Sleep on your side"]
  },
  {
    week: 20,
    size: "Banana",
    weight: "10.6 oz",
    developments: ["Hair growing", "Vernix coating skin", "Practice breathing"],
    tips: ["Anatomy scan ultrasound", "Track fetal movements"]
  },
  {
    week: 24,
    size: "Ear of corn",
    weight: "1.3 lbs",
    developments: ["Lungs developing", "Taste buds forming", "Sleep cycles established"],
    tips: ["Monitor for contractions", "Take childbirth classes"]
  },
  {
    week: 28,
    size: "Eggplant",
    weight: "2.2 lbs",
    developments: ["Eyes can open", "Brain developing rapidly", "Bones fully developed"],
    tips: ["Start kick counts", "Plan maternity leave"]
  },
  {
    week: 32,
    size: "Squash",
    weight: "3.8 lbs",
    developments: ["Practicing breathing", "Gaining weight rapidly", "Moving less"],
    tips: ["Pack hospital bag", "Install car seat"]
  },
  {
    week: 36,
    size: "Romaine lettuce",
    weight: "5.8 lbs",
    developments: ["Almost fully developed", "Gaining fat", "Head may engage"],
    tips: ["Watch for labor signs", "Rest frequently"]
  },
  {
    week: 40,
    size: "Watermelon",
    weight: "7.5 lbs",
    developments: ["Full term", "Ready for birth", "Strong immune system"],
    tips: ["Know labor signs", "Have birth plan ready"]
  }
]

export default function PregnancyPage() {
  const { user } = useAuth()
  const [pregnancies, setPregnancies] = useState<Pregnancy[]>([])
  const [pregnancyUpdates, setPregnancyUpdates] = useState<PregnancyUpdate[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [updateWeight, setUpdateWeight] = useState('')
  const [updateSymptoms, setUpdateSymptoms] = useState('')
  const [updateNotes, setUpdateNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockPregnancy: Pregnancy = {
      id: '1',
      startDate: new Date(2024, 0, 1),
      dueDate: new Date(2024, 9, 8),
      currentWeek: 20,
      isCurrent: true,
      notes: 'First pregnancy, excited!'
    }

    const mockUpdates: PregnancyUpdate[] = [
      {
        id: '1',
        pregnancyId: '1',
        week: 12,
        weight: 125,
        symptoms: 'Morning sickness, fatigue',
        notes: 'First trimester complete!'
      },
      {
        id: '2',
        pregnancyId: '1',
        week: 16,
        weight: 128,
        symptoms: 'Feeling better, more energy',
        notes: 'Started feeling movements'
      },
      {
        id: '3',
        pregnancyId: '1',
        week: 20,
        weight: 132,
        symptoms: 'Some back pain, heartburn',
        notes: 'Anatomy scan went well!'
      }
    ]

    setPregnancies([mockPregnancy])
    setPregnancyUpdates(mockUpdates)
  }, [])

  const currentPregnancy = pregnancies.find(p => p.isCurrent)
  const currentWeek = currentPregnancy?.currentWeek || 0
  const daysUntilDue = currentPregnancy ? differenceInDays(currentPregnancy.dueDate, new Date()) : 0

  const handleAddPregnancy = async () => {
    if (!lastPeriodDate || !dueDate) return

    setLoading(true)
    try {
      const startDate = new Date(lastPeriodDate)
      const due = new Date(dueDate)
      const week = Math.floor(differenceInWeeks(new Date(), startDate))

      const newPregnancy: Pregnancy = {
        id: Date.now().toString(),
        startDate,
        dueDate: due,
        currentWeek: week,
        isCurrent: true,
        notes
      }

      // Set other pregnancies as non-current
      setPregnancies(prev => prev.map(p => ({ ...p, isCurrent: false })))
      setPregnancies(prev => [...prev, newPregnancy])
      setIsDialogOpen(false)
      setLastPeriodDate('')
      setDueDate('')
      setNotes('')
    } catch (error) {
      console.error('Error adding pregnancy:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUpdate = async () => {
    if (!currentPregnancy) return

    setLoading(true)
    try {
      const newUpdate: PregnancyUpdate = {
        id: Date.now().toString(),
        pregnancyId: currentPregnancy.id,
        week: currentWeek,
        weight: updateWeight ? parseFloat(updateWeight) : undefined,
        symptoms: updateSymptoms,
        notes: updateNotes
      }

      setPregnancyUpdates(prev => [...prev, newUpdate])
      setIsUpdateDialogOpen(false)
      setUpdateWeight('')
      setUpdateSymptoms('')
      setUpdateNotes('')
    } catch (error) {
      console.error('Error adding update:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFetalDevelopment = (week: number) => {
    // Find the closest week in our data
    const sortedData = [...fetalDevelopmentData].sort((a, b) => b.week - a.week)
    return sortedData.find(d => week >= d.week) || fetalDevelopmentData[0]
  }

  const getTrimester = (week: number) => {
    if (week <= 12) return 1
    if (week <= 27) return 2
    return 3
  }

  const getProgressPercentage = () => {
    if (!currentPregnancy) return 0
    const totalWeeks = 40
    return Math.min((currentWeek / totalWeeks) * 100, 100)
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pregnancy Mode</h1>
            <p className="text-gray-600 mt-1">Track your pregnancy journey and fetal development</p>
          </div>
          {!currentPregnancy ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Pregnancy Tracking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start Pregnancy Tracking</DialogTitle>
                  <DialogDescription>
                    Enter your pregnancy details to begin tracking
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastPeriod">Last Period Date</Label>
                    <Input
                      id="lastPeriod"
                      type="date"
                      value={lastPeriodDate}
                      onChange={(e) => setLastPeriodDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any notes about this pregnancy..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddPregnancy} disabled={loading} className="w-full">
                    {loading ? 'Adding...' : 'Start Tracking'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Weekly Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Weekly Update - Week {currentWeek}</DialogTitle>
                  <DialogDescription>
                    Log your current symptoms and measurements
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="150"
                      value={updateWeight}
                      onChange={(e) => setUpdateWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="How are you feeling?"
                      value={updateSymptoms}
                      onChange={(e) => setUpdateSymptoms(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateNotes">Notes</Label>
                    <Textarea
                      id="updateNotes"
                      placeholder="Any additional notes..."
                      value={updateNotes}
                      onChange={(e) => setUpdateNotes(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddUpdate} disabled={loading} className="w-full">
                    {loading ? 'Adding...' : 'Add Update'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {!currentPregnancy ? (
          <Card>
            <CardContent className="text-center py-12">
              <Baby className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pregnancy Tracking</h3>
              <p className="text-gray-600 mb-4">Start tracking your pregnancy to see fetal development and get weekly insights</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Pregnancy Tracking
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Week</CardTitle>
                  <Baby className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Week {currentWeek}</div>
                  <p className="text-xs text-muted-foreground">
                    Trimester {getTrimester(currentWeek)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Due Date</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {format(currentPregnancy.dueDate, 'MMM dd')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {daysUntilDue > 0 ? `${daysUntilDue} days to go` : 'Overdue'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(getProgressPercentage())}%</div>
                  <Progress value={getProgressPercentage()} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Updates</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pregnancyUpdates.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Weekly logs
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="development" className="space-y-4">
              <TabsList>
                <TabsTrigger value="development">Fetal Development</TabsTrigger>
                <TabsTrigger value="updates">Weekly Updates</TabsTrigger>
                <TabsTrigger value="tips">Tips & Education</TabsTrigger>
              </TabsList>

              <TabsContent value="development">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Development</CardTitle>
                      <CardDescription>
                        Week {currentWeek} Fetal Development
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const development = getFetalDevelopment(currentWeek)
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Size</span>
                              <Badge variant="secondary">{development.size}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Weight</span>
                              <Badge variant="secondary">{development.weight}</Badge>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Developments</h4>
                              <ul className="space-y-1">
                                {development.developments.map((item, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pregnancy Timeline</CardTitle>
                      <CardDescription>
                        Key milestones throughout your pregnancy
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${currentWeek >= 12 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">End of First Trimester</p>
                            <p className="text-xs text-gray-600">Week 12</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${currentWeek >= 20 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Anatomy Scan</p>
                            <p className="text-xs text-gray-600">Week 20</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${currentWeek >= 27 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">End of Second Trimester</p>
                            <p className="text-xs text-gray-600">Week 27</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${currentWeek >= 37 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Full Term</p>
                            <p className="text-xs text-gray-600">Week 37</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="updates">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Updates</CardTitle>
                    <CardDescription>
                      Track your symptoms and progress throughout pregnancy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {pregnancyUpdates.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No updates yet</p>
                      ) : (
                        [...pregnancyUpdates]
                          .sort((a, b) => b.week - a.week)
                          .map((update) => (
                            <div key={update.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium">Week {update.week}</h4>
                                {update.weight && (
                                  <Badge variant="outline">
                                    <Weight className="h-3 w-3 mr-1" />
                                    {update.weight} lbs
                                  </Badge>
                                )}
                              </div>
                              {update.symptoms && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                                  <p className="text-sm text-gray-600">{update.symptoms}</p>
                                </div>
                              )}
                              {update.notes && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                                  <p className="text-sm text-gray-600">{update.notes}</p>
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tips">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Week Tips</CardTitle>
                      <CardDescription>
                        Personalized advice for week {currentWeek}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const development = getFetalDevelopment(currentWeek)
                        return (
                          <div className="space-y-3">
                            {development.tips.map((tip, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{tip}</p>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>General Pregnancy Health</CardTitle>
                      <CardDescription>
                        Important reminders for all trimesters
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Take prenatal vitamins daily</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Stay hydrated - drink 8-10 glasses of water</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Get regular gentle exercise</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Attend all prenatal appointments</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Get adequate rest and sleep</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AuthGuard>
  )
}