"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-mono text-[#333] bg-brand-bg">
      {/* Header */}
      <header className="bg-brand-orange py-6 px-6 shadow-md shadow-black/30">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 md:flex-row md:justify-between">

          {/* Mobile/Left Layout Group */}
          <div className="flex w-full items-center justify-between md:hidden">
            <div className="w-[80px]">
              <Image
                src="/esquerda_topo.png"
                alt="Imagem à esquerda"
                width={120}
                height={120}
                className="h-auto w-full rounded-lg"
                priority
              />
            </div>
            <div className="w-[80px]">
              <Image
                src="/diretira_topo.png"
                alt="Imagem à direita"
                width={120}
                height={120}
                className="h-auto w-full rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Desktop Left Image */}
          <div className="hidden w-[100px] md:block md:w-[120px]">
            <Image
              src="/esquerda_topo.png"
              alt="Imagem à esquerda"
              width={120}
              height={120}
              className="h-auto w-full rounded-lg"
              priority
            />
          </div>

          {/* Logo Center */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/logo-listening.png"
              alt="Listening Research"
              width={300}
              height={100}
              className="h-[80px] w-auto md:h-[100px]"
              priority
            />
          </div>

          {/* Desktop Right Image & Nav */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="hidden w-[100px] md:block md:w-[120px]">
              <Image
                src="/diretira_topo.png"
                alt="Imagem à direita"
                width={120}
                height={120}
                className="h-auto w-full rounded-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Navigation Bar (Integrated below header content for cleaner look) */}
        <div className="mx-auto mt-6 flex max-w-[1400px] justify-center gap-6 md:justify-end">
          <Link
            href="/login"
            className="text-lg font-bold text-white hover:text-brand-yellow transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-yellow px-6 py-2 text-lg font-bold text-brand-orange transition-all hover:scale-105 hover:bg-white hover:shadow-lg"
          >
            Começar Agora
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-[#333] sm:text-6xl">
            Participe das pesquisas e compartilhe sua opinião
          </h1>
          <p className="max-w-2xl text-xl text-[#555] leading-relaxed">
            Suas respostas ajudam a melhorar ações, programas e serviços nas comunidades.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row mt-4">
            <Link
              href="/register"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-orange px-8 text-base font-bold text-white transition-all hover:bg-brand-yellow hover:scale-105 hover:shadow-lg"
            >
              Criar Conta Grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#e0e0e0] bg-white px-8 text-base font-bold text-[#333] transition-colors hover:border-brand-orange hover:text-brand-orange hover:shadow-md"
            >
              Fazer Login
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-[#e0e0e0] bg-[#f8f8f8] px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-[#333]">
              Ferramenta de Pesquisas e Opinião
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  title: "Monitoramento de Impacto",
                  description:
                    "Perguntas regulares sobre mudanças percebidas, experiências recentes e efeitos no cotidiano.",
                },
                {
                  title: "Segurança de Dados",
                  description:
                    "Ambiente seguro com criptografia de ponta e total conformidade com as políticas de governança e LGPD.",
                },
                {
                  title: "Gestão Estratégica",
                  description:
                    "Pesquisas para entender prioridades, opiniões e sugestões em diferentes temas do dia a dia.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group rounded-xl border-2 border-[#e0e0e0] bg-white p-8 transition-all hover:-translate-y-1 hover:border-brand-orange hover:shadow-[0_8px_25px_rgba(196,207,74,0.3)]"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-lime text-brand-orange">
                    <Check className="h-6 w-6 stroke-[3px]" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#333]">
                    {feature.title}
                  </h3>
                  <p className="text-[#555] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white p-10 text-center text-[#666]">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <Image
            src="/logo_pe.png"
            alt="Holding Inpacto"
            width={200}
            height={60}
            className="h-auto max-w-[180px]"
          />
          <Image
            src="/regua.png"
            alt="Régua de marcas"
            width={800}
            height={100}
            className="h-auto w-full max-w-[90%] opacity-90"
          />
        </div>
        <p className="font-bold">&copy; {new Date().getFullYear()} Listening Research. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}