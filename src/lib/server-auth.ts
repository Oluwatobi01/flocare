import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return { supabase, session }
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return { supabase, session: null }
  }
}

export async function getUser() {
  const { session } = await createClient()
  return session?.user || null
}