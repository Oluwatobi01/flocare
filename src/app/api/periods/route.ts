import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const periods = await db.period.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json({ periods })
  } catch (error: any) {
    console.error('Get periods error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, startDate, endDate, flowIntensity, notes } = await request.json()
    
    if (!userId || !startDate) {
      return NextResponse.json({ error: 'User ID and start date required' }, { status: 400 })
    }

    const period = await db.period.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        flowIntensity,
        notes
      }
    })

    return NextResponse.json({ 
      message: 'Period created successfully',
      period 
    })
  } catch (error: any) {
    console.error('Create period error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}