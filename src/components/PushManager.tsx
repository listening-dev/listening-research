'use client'

import { useEffect } from 'react'

export default function PushManager() {
    useEffect(() => {
        const register = async () => {
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                try {
                    const { initializeApp, getApps } = await import('firebase/app')
                    const { getMessaging, getToken } = await import('firebase/messaging')

                    const firebaseConfig = {
                        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                    }

                    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
                    const messaging = getMessaging(app)

                    const permission = await Notification.requestPermission()
                    if (permission === 'granted') {
                        const token = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        })

                        if (token) {
                            await fetch('/api/push/register', {
                                method: 'POST',
                                body: JSON.stringify({ token }),
                                headers: { 'Content-Type': 'application/json' }
                            })
                        }
                    }
                } catch (error) {
                    console.error('Push registration failed', error)
                }
            }
        }

        register()
    }, [])

    return null
}
