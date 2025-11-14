import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const pregnancies = await db.pregnancy.findMany({
      where: { userId },
      include: {
        weeklyUpdates: {
          orderBy: { week: 'desc' }
        }
      },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json({ pregnancies })
  } catch (error: any) {
    console.error('Get pregnancies error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, startDate, dueDate, notes } = await request.json()
    
    if (!userId || !startDate || !dueDate) {
      return NextResponse.json({ error: 'User ID, start date, and due date required' }, { status: 400 })
    }

    // Set other pregnancies as non-current
    await db.pregnancy.updateMany({
      where: { userId },
      data: { isCurrent: false }
    })

    const pregnancy = await db.pregnancy.create({
      data: {
        userId,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        currentWeek: Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)),
        notes
      }
    })

    return NextResponse.json({ 
      message: 'Pregnancy created successfully',
      pregnancy 
    })
  } catch (error: any) {
    console.error('Create pregnancy error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}