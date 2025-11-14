import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const symptoms = await db.symptomLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ symptoms })
  } catch (error: any) {
    console.error('Get symptoms error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      date, 
      mood, 
      physicalSymptoms, 
      sleepHours, 
      sleepQuality, 
      energyLevel, 
      notes 
    } = await request.json()
    
    if (!userId || !date) {
      return NextResponse.json({ error: 'User ID and date required' }, { status: 400 })
    }

    const symptom = await db.symptomLog.create({
      data: {
        userId,
        date: new Date(date),
        mood,
        physicalSymptoms: physicalSymptoms ? JSON.stringify(physicalSymptoms) : null,
        sleepHours,
        sleepQuality,
        energyLevel,
        notes
      }
    })

    return NextResponse.json({ 
      message: 'Symptom log created successfully',
      symptom 
    })
  } catch (error: any) {
    console.error('Create symptom error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}