import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const { token } = await request.json()
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    if (!token) return new NextResponse('Missing token', { status: 400 })

    const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
            user_id: user.id,
            token,
            updated_at: new Date().toISOString()
        }, { onConflict: 'token' })

    if (error) return new NextResponse(error.message, { status: 500 })

    return new NextResponse('OK')
}
