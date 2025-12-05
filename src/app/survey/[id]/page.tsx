import { createClient } from '@/lib/supabase/server'
import SurveyForm from '@/components/SurveyForm'
import { redirect } from 'next/navigation'

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
            <div className="flex h-[50vh] flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900">Pesquisa não encontrada</h1>
                <p className="text-gray-500">A pesquisa que você tentou acessar não existe ou foi removida.</p>
                <a href="/respondent" className="mt-4 text-brand-orange hover:underline">Voltar ao painel</a>
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
