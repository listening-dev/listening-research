import { createClient } from '@/lib/supabase/server'
import SurveyForm from '@/components/SurveyForm'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SurveyPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // 1. Fetch Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', params.id)
        .single()

    if (surveyError || !survey) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600">Pesquisa não encontrada</h1>
                    <p className="mt-2 text-gray-500">Não foi possível carregar a pesquisa.</p>

                    {/* Debug Info for User */}
                    <div className="mt-6 rounded bg-gray-100 p-4 text-left text-xs font-mono text-gray-700">
                        <p><strong>Debug Info:</strong></p>
                        <p>ID: {params.id}</p>
                        <p>Error: {surveyError?.message || 'Nenhum dado retornado'}</p>
                        <p>Code: {surveyError?.code}</p>
                    </div>

                    <a href="/respondent" className="mt-6 inline-block rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">
                        Voltar ao painel
                    </a>
                </div>
            </div>
        )
    }

    // 2. Fetch Questions
    const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select(`
            *,
            options:question_options(*)
        `)
        .eq('survey_id', params.id)
        .order('order_index', { ascending: true })

    // Sort options correctly
    const sortedQuestions = questions?.map((q) => ({
        ...q,
        options: q.options?.sort((a: any, b: any) => a.order_index - b.order_index)
    })) || []

    return (
        <div className="min-h-screen bg-gray-50">
            <SurveyForm
                surveyId={survey.id}
                title={survey.title}
                description={survey.description}
                questions={sortedQuestions}
            />
        </div>
    )
}
