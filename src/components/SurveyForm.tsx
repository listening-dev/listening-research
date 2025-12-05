'use client'

import { useState } from 'react'
import QuestionRenderer from '@/components/QuestionRenderer'
import { submitResponse } from '@/app/survey/[id]/actions'
import { toast } from 'sonner'
import { Send, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type SurveyFormProps = {
    surveyId: string
    title: string
    description: string
    questions: any[]
}

export default function SurveyForm({ surveyId, title, description, questions }: SurveyFormProps) {
    const [answers, setAnswers] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const result = await submitResponse(surveyId, answers)
            if (result?.error) {
                toast.error('Erro ao enviar: ' + result.error)
            } else {
                toast.success('Pesquisa enviada com sucesso!')
                // Force a router refresh to update the dashboard status
                router.refresh()
            }
        } catch (error) {
            toast.error('Erro inesperado ao enviar pesquisa')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-gray-600">{description}</p>
            </div>

            <div className="space-y-6">
                {questions.map((q) => (
                    <div key={q.id} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-shadow hover:shadow-md">
                        <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                            {q.order_index}. {q.text}
                            {q.is_required && <span className="ml-1 text-red-500">*</span>}
                        </h3>
                        <QuestionRenderer
                            question={q}
                            onChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        'Enviando...'
                    ) : (
                        <>
                            Finalizar Pesquisa
                            <Send className="h-4 w-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
