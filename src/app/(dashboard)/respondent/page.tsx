import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle, Clock, ArrowRight } from 'lucide-react'

export default async function RespondentDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch published surveys
    const { data: surveys } = await supabase
        .from('surveys')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    // Fetch user responses to check completion
    const { data: responses } = await supabase
        .from('responses')
        .select('survey_id, status')
        .eq('user_id', user?.id)

    const completedSurveyIds = new Set(responses?.map(r => r.survey_id))

    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    Painel do Pesquisador
                </h1>
                <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Participe das pesquisas ativas e contribua com sua opinião.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {surveys?.map((survey) => {
                    const isCompleted = completedSurveyIds.has(survey.id)
                    return (
                        <div
                            key={survey.id}
                            className={`relative flex flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-lg ${isCompleted ? 'bg-gray-50 border border-gray-200 opacity-80' : 'bg-white shadow-sm ring-1 ring-gray-900/5'
                                }`}
                        >
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isCompleted
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-brand-orange/10 text-brand-orange'
                                        }`}>
                                        {isCompleted ? 'Concluída' : 'Disponível'}
                                    </div>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        5 min
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold leading-6 text-gray-900">
                                    {survey.title}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                    {survey.description}
                                </p>
                            </div>

                            <div className={`flex items-center justify-between border-t p-6 ${isCompleted ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-gray-50/50'}`}>
                                <div className="text-sm font-medium text-gray-900">
                                    +{survey.points_per_response} pontos
                                </div>
                                {isCompleted ? (
                                    <span className="flex items-center text-sm font-medium text-green-600">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Respondido
                                    </span>
                                ) : (
                                    <Link
                                        href={`/survey/${survey.id}`}
                                        className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                                    >
                                        Responder
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )
                })}

                {(!surveys || surveys.length === 0) && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                        <div className="rounded-full bg-gray-100 p-4">
                            <Clock className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-gray-900">Nenhuma pesquisa disponível</h3>
                        <p className="mt-1 text-sm text-gray-500">Volte mais tarde para novas pesquisas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
