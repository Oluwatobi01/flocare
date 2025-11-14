'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarIcon, Droplets, Heart, Plus, TrendingUp } from 'lucide-react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns'

interface Period {
  id: string
  startDate: Date
  endDate?: Date
  flowIntensity?: string
  notes?: string
}

export default function PeriodPage() {
  const { user } = useAuth()
  const [periods, setPeriods] = useState<Period[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [flowIntensity, setFlowIntensity] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockPeriods: Period[] = [
      {
        id: '1',
        startDate: new Date(2024, 0, 15),
        endDate: new Date(2024, 0, 19),
        flowIntensity: 'medium',
        notes: 'Normal period'
      },
      {
        id: '2',
        startDate: new Date(2024, 1, 12),
        endDate: new Date(2024, 1, 16),
        flowIntensity: 'heavy',
        notes: 'Heavier flow this month'
      },
      {
        id: '3',
        startDate: new Date(2024, 2, 10),
        endDate: new Date(2024, 2, 14),
        flowIntensity: 'light',
        notes: 'Lighter flow'
      }
    ]
    setPeriods(mockPeriods)
  }, [])

  const handleAddPeriod = async () => {
    if (!startDate) return

    setLoading(true)
    try {
      const newPeriod: Period = {
        id: Date.now().toString(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        flowIntensity,
        notes
      }

      setPeriods([...periods, newPeriod])
      setIsDialogOpen(false)
      setStartDate('')
      setEndDate('')
      setFlowIntensity('')
      setNotes('')
    } catch (error) {
      console.error('Error adding period:', error)
    } finally {
      setLoading(false)
    }
  }

  const isPeriodDay = (date: Date) => {
    return periods.some(period => {
      if (!period.endDate) return isSameDay(date, period.startDate)
      return isWithinInterval(date, {
        start: period.startDate,
        end: period.endDate
      })
    })
  }

  const getPeriodIntensity = (date: Date) => {
    const period = periods.find(p => {
      if (!p.endDate) return isSameDay(date, p.startDate)
      return isWithinInterval(date, { start: p.startDate, end: p.endDate })
    })
    return period?.flowIntensity
  }

  const calculateAverageCycleLength = () => {
    if (periods.length < 2) return 28
    
    const sortedPeriods = [...periods].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    const cycleLengths = []
    
    for (let i = 1; i < sortedPeriods.length; i++) {
      const daysDiff = Math.floor((sortedPeriods[i].startDate.getTime() - sortedPeriods[i-1].startDate.getTime()) / (1000 * 60 * 60 * 24))
      cycleLengths.push(daysDiff)
    }
    
    return Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
  }

  const predictNextPeriod = () => {
    if (periods.length === 0) return null
    const lastPeriod = [...periods].sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0]
    const avgCycleLength = calculateAverageCycleLength()
    return addDays(lastPeriod.startDate, avgCycleLength)
  }

  const predictOvulation = () => {
    const nextPeriod = predictNextPeriod()
    if (!nextPeriod) return null
    return addDays(nextPeriod, -14)
  }

  const getFertileWindow = () => {
    const ovulation = predictOvulation()
    if (!ovulation) return null
    return {
      start: addDays(ovulation, -5),
      end: addDays(ovulation, 1)
    }
  }

  const modifiers = {
    period: (date: Date) => isPeriodDay(date),
    fertile: (date: Date) => {
      const fertile = getFertileWindow()
      return fertile ? isWithinInterval(date, fertile) : false
    },
    ovulation: (date: Date) => {
      const ovulation = predictOvulation()
      return ovulation ? isSameDay(date, ovulation) : false
    }
  }

  const modifiersStyles = {
    period: { backgroundColor: 'rgba(236, 72, 153, 0.2)', color: 'rgb(236, 72, 153)' },
    fertile: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'rgb(34, 197, 94)' },
    ovulation: { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'rgb(59, 130, 246)' }
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Period Tracking</h1>
            <p className="text-gray-600 mt-1">Track your cycle and predict future periods</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Your Period</DialogTitle>
                <DialogDescription>
                  Add details about your current or recent period
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flowIntensity">Flow Intensity</Label>
                  <Select value={flowIntensity} onValueChange={setFlowIntensity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select flow intensity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any symptoms or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddPeriod} disabled={loading} className="w-full">
                  {loading ? 'Adding...' : 'Add Period'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Cycle</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateAverageCycleLength()} days</div>
              <p className="text-xs text-muted-foreground">
                Based on your last {periods.length} periods
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Period</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {predictNextPeriod() ? format(predictNextPeriod()!, 'MMM dd') : '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                Predicted start date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fertile Window</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getFertileWindow() ? 
                  `${format(getFertileWindow()!.start, 'MMM dd')} - ${format(getFertileWindow()!.end, 'MMM dd')}` : 
                  '---'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Most fertile days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Visual representation of your cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-200 rounded"></div>
                    <span>Period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span>Fertile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span>Ovulation</span>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Periods</CardTitle>
              <CardDescription>
                Your period history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {periods.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No periods logged yet</p>
                ) : (
                  [...periods]
                    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
                    .map((period) => (
                      <div key={period.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-pink-500" />
                            <span className="font-medium">
                              {format(period.startDate, 'MMMM yyyy')}
                            </span>
                          </div>
                          <Badge variant={period.flowIntensity === 'heavy' ? 'destructive' : 
                                       period.flowIntensity === 'medium' ? 'default' : 'secondary'}>
                            {period.flowIntensity || 'Not specified'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Start: {format(period.startDate, 'MMM dd, yyyy')}</p>
                          {period.endDate && (
                            <p>End: {format(period.endDate, 'MMM dd, yyyy')}</p>
                          )}
                          {period.endDate && (
                            <p>Duration: {Math.floor((period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days</p>
                          )}
                          {period.notes && (
                            <p className="mt-2 italic">Notes: {period.notes}</p>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}