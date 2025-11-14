'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { 
  Plus, 
  TrendingUp, 
  Activity, 
  Moon, 
  Frown, 
  Smile, 
  Meh,
  Calendar
} from 'lucide-react'
import { format, subDays, startOfDay } from 'date-fns'

interface SymptomLog {
  id: string
  date: Date
  mood: string
  physicalSymptoms: string[]
  sleepHours: number
  sleepQuality: string
  energyLevel: string
  notes: string
}

const moodOptions = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-500' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-yellow-500' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500' },
  { value: 'anxious', label: 'Anxious', icon: Activity, color: 'text-purple-500' }
]

const physicalSymptomsOptions = [
  'Cramps',
  'Headache',
  'Bloating',
  'Breast Tenderness',
  'Fatigue',
  'Nausea',
  'Back Pain',
  'Acne',
  'Food Cravings',
  'Dizziness'
]

const energyLevels = ['high', 'medium', 'low']
const sleepQualities = ['good', 'fair', 'poor']

export default function SymptomsPage() {
  const { user } = useAuth()
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [mood, setMood] = useState('')
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([])
  const [sleepHours, setSleepHours] = useState('')
  const [sleepQuality, setSleepQuality] = useState('')
  const [energyLevel, setEnergyLevel] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockLogs: SymptomLog[] = [
      {
        id: '1',
        date: subDays(new Date(), 1),
        mood: 'happy',
        physicalSymptoms: ['Cramps', 'Bloating'],
        sleepHours: 7,
        sleepQuality: 'good',
        energyLevel: 'medium',
        notes: 'Feeling good today'
      },
      {
        id: '2',
        date: subDays(new Date(), 2),
        mood: 'neutral',
        physicalSymptoms: ['Headache', 'Fatigue'],
        sleepHours: 6,
        sleepQuality: 'fair',
        energyLevel: 'low',
        notes: 'Tired from work'
      },
      {
        id: '3',
        date: subDays(new Date(), 3),
        mood: 'anxious',
        physicalSymptoms: ['Breast Tenderness'],
        sleepHours: 8,
        sleepQuality: 'poor',
        energyLevel: 'low',
        notes: 'Feeling anxious about upcoming deadline'
      },
      {
        id: '4',
        date: subDays(new Date(), 4),
        mood: 'happy',
        physicalSymptoms: [],
        sleepHours: 7.5,
        sleepQuality: 'good',
        energyLevel: 'high',
        notes: 'Great day!'
      },
      {
        id: '5',
        date: subDays(new Date(), 5),
        mood: 'sad',
        physicalSymptoms: ['Cramps', 'Back Pain'],
        sleepHours: 5,
        sleepQuality: 'poor',
        energyLevel: 'low',
        notes: 'Period started'
      }
    ]
    setSymptomLogs(mockLogs)
  }, [])

  const handleAddSymptomLog = async () => {
    if (!selectedDate || !mood) return

    setLoading(true)
    try {
      const newLog: SymptomLog = {
        id: Date.now().toString(),
        date: new Date(selectedDate),
        mood,
        physicalSymptoms,
        sleepHours: parseFloat(sleepHours) || 0,
        sleepQuality,
        energyLevel,
        notes
      }

      setSymptomLogs([...symptomLogs, newLog])
      setIsDialogOpen(false)
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
      setMood('')
      setPhysicalSymptoms([])
      setSleepHours('')
      setSleepQuality('')
      setEnergyLevel('')
      setNotes('')
    } catch (error) {
      console.error('Error adding symptom log:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSymptomToggle = (symptom: string) => {
    setPhysicalSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  // Prepare data for charts
  const chartData = [...symptomLogs]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(log => ({
      date: format(log.date, 'MMM dd'),
      mood: log.mood === 'happy' ? 4 : log.mood === 'neutral' ? 3 : log.mood === 'sad' ? 2 : 1,
      sleep: log.sleepHours,
      energy: log.energyLevel === 'high' ? 3 : log.energyLevel === 'medium' ? 2 : 1,
      sleepQuality: log.sleepQuality === 'good' ? 3 : log.sleepQuality === 'fair' ? 2 : 1
    }))

  const getMostCommonSymptoms = () => {
    const symptomCounts: { [key: string]: number } = {}
    symptomLogs.forEach(log => {
      log.physicalSymptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
      })
    })
    return Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count }))
  }

  const getAverageSleep = () => {
    if (symptomLogs.length === 0) return 0
    const total = symptomLogs.reduce((sum, log) => sum + log.sleepHours, 0)
    return (total / symptomLogs.length).toFixed(1)
  }

  const getMoodDistribution = () => {
    const moodCounts: { [key: string]: number } = {}
    symptomLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
    })
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
      count
    }))
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Symptom Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor your daily symptoms and patterns</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Symptoms
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log Your Symptoms</DialogTitle>
                <DialogDescription>
                  Track how you're feeling today
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>How are you feeling today?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {moodOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Button
                          key={option.value}
                          variant={mood === option.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setMood(option.value)}
                        >
                          <Icon className={`h-4 w-4 mr-2 ${mood === option.value ? '' : option.color}`} />
                          {option.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Physical Symptoms</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {physicalSymptomsOptions.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={physicalSymptoms.includes(symptom)}
                          onCheckedChange={() => handleSymptomToggle(symptom)}
                        />
                        <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sleepHours">Sleep Hours</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      placeholder="7.5"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sleepQuality">Sleep Quality</Label>
                    <Select value={sleepQuality} onValueChange={setSleepQuality}>
                      <SelectTrigger>
                        <SelectValue placeholder="Quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {sleepQualities.map((quality) => (
                          <SelectItem key={quality} value={quality}>
                            {quality.charAt(0).toUpperCase() + quality.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="energyLevel">Energy Level</Label>
                    <Select value={energyLevel} onValueChange={setEnergyLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Energy" />
                      </SelectTrigger>
                      <SelectContent>
                        {energyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddSymptomLog} disabled={loading} className="w-full">
                  {loading ? 'Adding...' : 'Add Log'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Sleep</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverageSleep()} hrs</div>
              <p className="text-xs text-muted-foreground">
                Per night
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{symptomLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                Days tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {getMostCommonSymptoms()[0]?.symptom || 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                Top symptom
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dominant Mood</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {getMoodDistribution()[0]?.mood || 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                Most frequent mood
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Sleep Trends</CardTitle>
              <CardDescription>
                Track your mood and sleep patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    name="Mood"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sleep" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Sleep Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Energy Levels</CardTitle>
              <CardDescription>
                Your energy throughout the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="energy" fill="#10b981" name="Energy Level" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Symptoms</CardTitle>
              <CardDescription>
                Your most frequently reported symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getMostCommonSymptoms().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No symptoms logged yet</p>
                ) : (
                  getMostCommonSymptoms().map(({ symptom, count }) => (
                    <div key={symptom} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{symptom}</span>
                      <Badge variant="secondary">{count} times</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Logs</CardTitle>
              <CardDescription>
                Your latest symptom entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {symptomLogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No logs yet</p>
                ) : (
                  [...symptomLogs]
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 5)
                    .map((log) => {
                      const moodOption = moodOptions.find(m => m.value === log.mood)
                      const Icon = moodOption?.icon || Meh
                      return (
                        <div key={log.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${moodOption?.color}`} />
                              <span className="font-medium text-sm">
                                {format(log.date, 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Moon className="h-3 w-3 text-blue-500" />
                              <span className="text-xs">{log.sleepHours}h</span>
                            </div>
                          </div>
                          {log.physicalSymptoms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {log.physicalSymptoms.map((symptom) => (
                                <Badge key={symptom} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {log.notes && (
                            <p className="text-xs text-gray-600 italic">{log.notes}</p>
                          )}
                        </div>
                      )
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}