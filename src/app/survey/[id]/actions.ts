'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitResponse(surveyId: string, responses: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Create Response Session
    const { data: responseData, error: responseError } = await supabase
        .from('responses')
        .insert({
            survey_id: surveyId,
            user_id: user.id,
            status: 'completed',
            completed_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (responseError) {
        return { error: responseError.message }
    }

    // 2. Insert Response Items
    const itemsToInsert = Object.entries(responses).map(([questionId, value]: [string, any]) => {
        // Handle different value types
        let item: any = {
            response_id: responseData.id,
            question_id: questionId,
        }

        if (value.value_text) item.value_text = value.value_text
        if (value.value_numeric) item.value_numeric = value.value_numeric
        if (value.option_id) item.option_id = value.option_id
        if (value.option_ids) {
            // For multiple choice, we might need multiple rows or store in JSON?
            // Schema says `option_id` is single UUID.
            // So for multiple choice, we should probably insert multiple rows?
            // OR change schema to support array.
            // The prompt said `response_items` has `option_id`.
            // If multiple choice, we should probably insert multiple items for the same question?
            // Yes, usually.
            // But here I'm mapping 1 response object per question.
            // I'll handle multiple choice specially below.
            return null // handled separately
        }
        if (value.ranking) {
            item.extra = { ranking: value.ranking }
        }

        return item
    }).filter(Boolean)

    // Handle multiple choice expansion
    const multipleChoiceItems: any[] = []
    Object.entries(responses).forEach(([questionId, value]: [string, any]) => {
        if (value.option_ids && Array.isArray(value.option_ids)) {
            value.option_ids.forEach((optId: string) => {
                multipleChoiceItems.push({
                    response_id: responseData.id,
                    question_id: questionId,
                    option_id: optId
                })
            })
        }
    })

    const allItems = [...itemsToInsert, ...multipleChoiceItems]

    if (allItems.length > 0) {
        const { error: itemsError } = await supabase
            .from('response_items')
            .insert(allItems)

        if (itemsError) {
            return { error: itemsError.message }
        }
    }

    // 3. Award Points
    // Fetch survey points
    const { data: survey } = await supabase
        .from('surveys')
        .select('points_per_response')
        .eq('id', surveyId)
        .single()

    if (survey?.points_per_response) {
        await supabase.from('user_points').insert({
            user_id: user.id,
            amount: survey.points_per_response,
            source_type: 'survey_completion',
            source_id: surveyId
        })
    }

    redirect('/dashboard/respondent')
}
