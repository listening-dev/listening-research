'use client'

import { login, signup, forgotPassword } from '../actions'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
    const [view, setView] = useState<'login' | 'forgot_password'>('login')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (formData: FormData) => {
        const result = await login(formData)
        if (result?.error) {
            toast.error(result.error)
        }
    }

    const handleSignup = async (formData: FormData) => {
        const result = await signup(formData)
        if (result?.error) {
            toast.error(result.error)
        } else if (result?.message) {
            toast.success(result.message)
        }
    }

    const handleForgotPassword = async (formData: FormData) => {
        const result = await forgotPassword(formData)
        if (result?.error) {
            toast.error(result.error)
        } else if (result?.message) {
            toast.success(result.message)
            setView('login') // Return to login after success
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bem-vindo</h2>
                    <p className="mt-2 text-sm text-gray-600">Entre para responder pesquisas e ganhar pontos</p>
                </div>

                {view === 'login' ? (
                    <form action={handleLogin} className="mt-8 space-y-6">
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
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    placeholder="Senha"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setView('forgot_password')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Esqueci minha senha
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Entrar
                            </button>
                            <button
                                formAction={handleSignup}
                                className="group relative flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Criar conta
                            </button>
                        </div>
                    </form>
                ) : (
                    <form action={handleForgotPassword} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email-address-recovery" className="sr-only">Email para recuperação</label>
                            <input
                                id="email-address-recovery"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Digite seu e-mail"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                Enviar E-mail de Recuperação
                            </button>
                            <button
                                type="button"
                                onClick={() => setView('login')}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                            >
                                Voltar para o Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
