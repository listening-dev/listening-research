import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const surveyId = searchParams.get('survey_id')
    const format = searchParams.get('format') || 'csv'

    const supabase = await createClient()

    // Check admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

    if (!surveyId) return new NextResponse('Missing survey_id', { status: 400 })

    // Fetch data
    // We need to join responses, response_items, questions, options
    // Supabase join syntax is a bit complex for deep nesting in one go if we want flat CSV
    // Let's fetch items and join manually or use a view.
    // For MVP, let's fetch response_items with related data.

    const { data: items, error } = await supabase
        .from('response_items')
        .select(`
      *,
      response:responses(user_id, created_at),
      question:questions(text, type),
      option:question_options(label, value)
    `)
        .eq('response.survey_id', surveyId) // This filtering on joined table might need !inner or separate query if not working directly
    // Actually, let's filter by response_id IN (select id from responses where survey_id = ...)

    // Better approach:
    const { data: responses } = await supabase
        .from('responses')
        .select('id, user_id, created_at')
        .eq('survey_id', surveyId)

    if (!responses || responses.length === 0) {
        return new NextResponse(format === 'json' ? '[]' : '', {
            headers: { 'Content-Type': format === 'json' ? 'application/json' : 'text/csv' }
        })
    }

    const responseIds = responses.map(r => r.id)

    const { data: responseItems } = await supabase
        .from('response_items')
        .select(`
        *,
        question:questions(id, text, type),
        option:question_options(label, value)
    `)
        .in('response_id', responseIds)

    // Map to standardized format
    const exportData = responseItems?.map(item => {
        const response = responses.find(r => r.id === item.response_id)
        return {
            survey_id: surveyId,
            user_id_hash: response?.user_id, // In real app, hash this
            question_id: item.question_id,
            question_type: item.question?.type,
            option_label: item.option?.label,
            value_numeric: item.value_numeric,
            value_text: item.value_text,
            response_timestamp: response?.created_at
        }
    })

    if (format === 'json') {
        return NextResponse.json(exportData)
    } else {
        // CSV
        const headers = ['survey_id', 'user_id_hash', 'question_id', 'question_type', 'option_label', 'value_numeric', 'value_text', 'response_timestamp']
        const csv = [
            headers.join(','),
            ...exportData!.map(row => headers.map(fieldName => {
                const val = (row as any)[fieldName]
                return val ? `"${String(val).replace(/"/g, '""')}"` : ''
            }).join(','))
        ].join('\n')

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="survey-${surveyId}.csv"`
            }
        })
    }
}
