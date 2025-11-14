import { createServiceClient } from '@/lib/supabase'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const supabase = createServiceClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get user from our database
    if (data.user) {
      const user = await db.user.findUnique({
        where: { supabaseId: data.user.id },
        include: {
          profile: true,
          subscription: true
        }
      })

      return NextResponse.json({ 
        message: 'Login successful',
        user: data.user,
        profile: user
      })
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}