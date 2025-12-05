'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import QuestionRenderer from '@/components/QuestionRenderer'
import { submitResponse } from './actions'
import { toast } from 'sonner'

export default function SurveyPage({ params }: { params: { id: string } }) {
    const [survey, setSurvey] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [answers, setAnswers] = useState<any>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSurvey = async () => {
            const supabase = await createClient()

            // Get survey details
            const { data: surveyData } = await supabase
                .from('surveys')
                .select('*')
                .eq('id', params.id)
                .single()

            setSurvey(surveyData)

            // Get questions and options
            const { data: questionsData } = await supabase
                .from('questions')
                .select(`
          *,
          options:question_options(*)
        `)
                .eq('survey_id', params.id)
                .order('order')

            // Sort options by order
            const sortedQuestions = questionsData?.map(q => ({
                ...q,
                options: q.options?.sort((a: any, b: any) => a.order - b.order)
            }))

            setQuestions(sortedQuestions || [])
            setLoading(false)
        }

        fetchSurvey()
    }, [params.id])

    const handleSubmit = async () => {
        // Basic validation
        // In a real app, check required fields

        try {
            await submitResponse(params.id, answers)
            toast.success('Pesquisa enviada com sucesso!')
        } catch (error) {
            toast.error('Erro ao enviar pesquisa')
        }
    }

    if (loading) return <div className="p-8">Carregando...</div>
    if (!survey) return <div className="p-8">Pesquisa não encontrada</div>

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-2xl px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
                    <p className="mt-2 text-gray-600">{survey.description}</p>
                </div>

                <div className="space-y-8">
                    {questions.map((q) => (
                        <div key={q.id} className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                {q.order}. {q.text}
                                {q.is_required && <span className="text-red-500 ml-1">*</span>}
                            </h3>
                            <QuestionRenderer
                                question={q}
                                onChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Finalizar Pesquisa
                    </button>
                </div>
            </div>
        </div>
    )
}
