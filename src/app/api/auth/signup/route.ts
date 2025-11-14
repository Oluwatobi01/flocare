import { createClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()
    
    const supabase = createServiceClient()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create user in our database
    if (data.user) {
      await db.user.create({
        data: {
          email: data.user.email!,
          name: fullName,
          supabaseId: data.user.id,
          profile: {
            create: {}
          },
          subscription: {
            create: {
              plan: 'free',
              status: 'active'
            }
          }
        }
      })
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      user: data.user 
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}