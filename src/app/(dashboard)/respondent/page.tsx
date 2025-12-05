import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function RespondentDashboard() {
    const supabase = await createClient()

    // Fetch published surveys
    const { data: surveys } = await supabase
        .from('surveys')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Pesquisas Disponíveis
            </h1>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {surveys?.map((survey) => (
                    <div key={survey.id} className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">{survey.title}</h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>{survey.description}</p>
                            </div>
                            <div className="mt-3 text-sm font-medium text-indigo-600">
                                +{survey.points_per_response} pontos
                            </div>
                            <div className="mt-5">
                                <Link
                                    href={`/survey/${survey.id}`}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Responder
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {(!surveys || surveys.length === 0) && (
                    <p className="text-gray-500">Nenhuma pesquisa disponível no momento.</p>
                )}
            </div>
        </div>
    )
}
