import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const results: any = {
        database: 'unknown',
        auth: 'unknown',
        surveys: 'unknown'
    }

    try {
        // Check DB connection by selecting count
        const { count, error: dbError } = await supabase.from('surveys').select('*', { count: 'exact', head: true })
        if (dbError) {
            results.database = `Error: ${dbError.message}`
        } else {
            results.database = 'Connected'
            results.surveyCount = count
        }

        // Check Auth (just check if we can call getUser, even if null)
        const { error: authError } = await supabase.auth.getUser()
        if (authError && authError.message !== 'Auth session missing!') {
            // Session missing is expected if not logged in, but connection error is bad
            // Actually getUser() usually returns null user if no session, not error, unless system error.
            results.auth = `Status: ${authError.message}`
        } else {
            results.auth = 'Service Reachable'
        }

    } catch (e: any) {
        results.error = e.message
    }

    return NextResponse.json(results)
}
