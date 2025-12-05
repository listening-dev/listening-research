import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PushManager from '@/components/PushManager'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = userData?.role || 'respondent'

    return (
        <div className="flex h-screen bg-gray-50">
            <PushManager />

            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4 space-x-2">
                        {/* Optional Logo Icon if available */}
                        <span className="text-xl font-bold text-brand-orange">Listening</span>
                        <span className="text-xl font-bold text-gray-900">Research</span>
                    </div>
                    <div className="mt-8 flex-grow flex flex-col">
                        <nav className="flex-1 px-2 space-y-1">
                            {role === 'respondent' && (
                                <>
                                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">
                                        Pesquisas
                                    </p>
                                    <Link
                                        href="/respondent"
                                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-brand-orange/10 text-brand-orange"
                                    >
                                        <span className="truncate">Norte Energia S/A</span>
                                    </Link>
                                </>
                            )}
                            {role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    Admin
                                </Link>
                            )}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <div className="flex items-center w-full">
                            <div className="ml-3 w-full">
                                <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                                <form action="/auth/signout" method="post" className="mt-1">
                                    <button className="text-xs font-medium text-gray-500 hover:text-gray-700">Sair</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header (simplified) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b z-10 p-4 flex justify-between items-center">
                <span className="font-bold text-brand-orange">Listening Research</span>
                <span className="text-xs text-gray-500">{user.email}</span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden md:static mt-14 md:mt-0">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
