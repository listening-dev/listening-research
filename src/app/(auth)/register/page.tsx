'use client'

import { signup } from '../actions'
import Link from 'next/link'

export default function RegisterPage() {
    const handleSignup = async (formData: FormData) => {
        const result = await signup(formData)
        if (result?.error) {
            // Assuming you have toast imported or just alert for now if not
            // But RegisterPage didn't import toast in my previous code.
            // I should add import toast from 'sonner'
            alert(result.error)
        } else if (result?.message) {
            alert(result.message)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Criar conta</h2>
                    <p className="mt-2 text-sm text-gray-600">Junte-se ao painel de pesquisas</p>
                </div>

                <form action={handleSignup} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Senha"
                            />
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id="lgpd"
                                name="lgpd"
                                type="checkbox"
                                required
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor="lgpd" className="font-medium text-gray-900">
                                Concordo com os termos
                            </label>
                            <p className="text-gray-500">
                                Aceito o tratamento dos meus dados pessoais para fins de pesquisa, conforme a LGPD.
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Cadastrar
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Já tem uma conta? Entre aqui
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
