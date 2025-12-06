'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    // Update login to return translated errors
    if (error) {
        if (error.message === 'Invalid login credentials') {
            return { error: 'E-mail ou senha incorretos.' }
        }
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/respondent')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Use absolute URL for production support
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { message: 'Verifique seu e-mail para continuar.' }
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/account/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { message: 'E-mail de recuperação enviado!' }
}
