import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        })
    } catch (error) {
        console.error('Firebase admin initialization error', error)
    }
}

export async function POST() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user's tokens
    const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('token')
        .eq('user_id', user.id)

    if (!subscriptions || subscriptions.length === 0) {
        return NextResponse.json({ message: 'No tokens found for user' }, { status: 404 })
    }

    const tokens = subscriptions.map(s => s.token)
    let successCount = 0
    let failureCount = 0

    // Send to all tokens
    const promises = tokens.map(async (token) => {
        try {
            await admin.messaging().send({
                token,
                notification: {
                    title: 'Test Notification',
                    body: 'This is a test message from the Survey Platform.',
                },
            })
            successCount++
        } catch (error) {
            console.error('Error sending to token:', token, error)
            failureCount++
            // Optional: Remove invalid tokens
        }
    })

    await Promise.all(promises)

    return NextResponse.json({
        message: 'Test finished',
        stats: { success: successCount, failure: failureCount }
    })
}
