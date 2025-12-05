import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    // 1. Create Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
            title: 'Norte Energia S/A',
            description: 'Norte Energia - 2025',
            status: 'published',
            points_per_response: 100
        })
        .select()
        .single()

    if (surveyError) return NextResponse.json({ error: surveyError }, { status: 500 })

    const surveyId = survey.id

    // Question Data
    const questions = [
        {
            text: 'Faixa etária',
            type: 'single',
            options: ['16 a 24 anos', '25 a 34 anos', '35 a 44 anos', '45 a 59 anos', '60 anos ou mais']
        },
        {
            text: 'Gênero',
            type: 'single',
            options: ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']
        },
        {
            text: 'Escolaridade',
            type: 'single',
            options: ['Fundamental Incompleto', 'Fundamental Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo']
        },
        {
            text: 'Renda familiar',
            type: 'single',
            options: ['Até 1 salário mínimo', '1 a 3 salários mínimos', '3 a 5 salários mínimos', 'Mais de 5 salários mínimos']
        },
        {
            text: 'Area urbana ou rural',
            type: 'single',
            options: ['Urbana', 'Rural']
        },
        {
            text: 'Como você costuma se informar sobre os temas da sua cidade?',
            type: 'text'
        },
        {
            text: 'Quais fontes de informação você considera mais confiáveis?',
            type: 'text'
        },
        {
            text: 'Em que redes sociais você tem perfil ativo atualmente?',
            type: 'multiple',
            options: ['Facebook', 'Instagram', 'WhatsApp', 'TikTok', 'X (Twitter)', 'LinkedIn', 'YouTube', 'Nenhuma']
        },
        {
            text: 'Você participa de grupos ou comunidades online que discutem temas relacionados à sua cidade ou estado? Se sim, quais?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Nos últimos 10 anos, Altamira recebeu investimentos significativos nas áreas de infraestrutura, saneamento básico, saúde e educação. Avaliando de forma geral o impacto desses investimentos, a vida de quem vive na cidade mudou para melhor, para pior ou esta igual?',
            type: 'single',
            options: ['Melhor', 'Pior', 'Igual', 'NS/NR']
        },
        {
            text: 'Na última década, foram construídos 3 novos hospitais e 31 novas Unidades Básicas de Saúde. Como você avalia a construção dessas novas estruturas para a saúde de quem vive em Altamira?',
            type: 'single',
            options: ['Muito importante', 'Importante', 'Pouco importante', 'Nada importante', 'NS/NR']
        },
        {
            text: 'Com relação à segurança, foi construído e entregue ao Governo do Pará um presídio em Vitória do Xingu e uma Delegacia Regional em Altamira. Você considera essas entregas para a população:',
            type: 'single',
            options: ['Muito importante', 'Importante', 'Pouco importante', 'Nada importante', 'NS/NR']
        },
        {
            text: 'Os agentes de segurança pública de Altamira receberam 34 motocicletas e 2 ônibus para o reforço da segurança regional. Já a Secretaria de Estado da Segurança recebeu um helicóptero. Como você classifica essas entregas:',
            type: 'single',
            options: ['Muito importante', 'Importante', 'Pouco importante', 'Nada importante', 'NS/NR']
        },
        {
            text: 'Mais de 30 mil famílias receberam algum atendimento social nos últimos 10 anos. Cerca de 6.500 são monitoradas periodicamente. Como resultado, houve uma redução de 22% no número de pessoas que vivem abaixo da linha de pobreza. Você percebe essa redução no dia a dia?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'A empresa responsável pela Usina de Belo Monte construiu um moderno sistema de coleta e tratamento de esgoto. Com isso, 90% da população que vive em Altamira, hoje, mora em locais com saneamento básico. O local onde você vive possui essa estrutura de saneamento?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Você acha importante Altamira ter aterro sanitário?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Quase 500 novas salas de aulas foram construídas nos últimos anos em Altamira. O que permitiu um aumento de quase 15 mil novas vagas em escolas públicas. Como você avalia essas entregas?',
            type: 'single',
            options: ['Muito positiva', 'Positiva', 'Neutra', 'Negativa']
        },
        {
            text: 'Cerca de 3.500 famílias muitas que viviam em palafitas - foram realocadas e passaram a viver em novas casas construídas que ficam em bairros planejados. Como você avalia a mudança para essas famílias?',
            type: 'single',
            options: ['Muito positiva', 'Positiva', 'Neutra', 'Negativa']
        },
        {
            text: 'Você sabia que o responsável pela MANUTENÇÃO de todas as melhorias citadas saúde, segurança, educação, saneamento - é o poder público municipal e estadual?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Como você descreveria sua percepção geral sobre a usina de Belo Monte?',
            type: 'single',
            options: ['Muito positiva', 'Positiva', 'Neutra', 'Negativa']
        },
        {
            text: 'Você sabia que a energia gerada pela Usina de Belo Monte beneficia até 60 milhões de brasileiros?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Você acredita que a instalação da usina trouxe melhorias para a infraestrutura da cidade?',
            type: 'single',
            options: ['Sim, muitas melhorias', 'Sim, algumas melhorias', 'Nenhuma melhoria']
        },
        {
            text: 'Vou citar alguns possíveis impactos gerados a partir da instalação da usina em Altamira e gostaria que você indicasse quais você acredita que tenham se concretizado',
            type: 'multiple',
            options: ['Aumento da renda', 'Comércio mais forte', 'Desenvolvimento econômico', 'Empregos melhores', 'Mais oferta de empregos', 'Mais turismo', 'Qualificação da mão de obra', 'Outras']
        },
        {
            text: 'Vou citar alguns recursos e gostaria que você indicasse aqueles que você sabe que os bairros planejados possuem',
            type: 'multiple',
            options: ['Equipamentos de lazer', 'Equipamentos de saúde e educação', 'Iluminação pública adequada', 'Infraestrutura completa', 'Ruas pavimentadas', 'Saneamento básico', 'Tratamento de água']
        },
        {
            text: 'Na sua opinião com a chegada da Usina de Belo Monte, o turismo local foi impactado positivamente ou não foi impactado?',
            type: 'single',
            options: ['Sim, positivamente', 'Não impactou']
        },
        {
            text: 'Você sabia que, com a chegada da Usina de Belo Monte, a oferta de empregos em toda a região foi ampliada?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Na sua opinião com a chegada da Usina de Belo Monte, a economia local está mais forte e dinâmica?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Especialistas apontam a emergência climática como causa de muitas crises em diferentes locais do mundo... Você acredita que a emergência climática tem gerado impactos na região, em especial na vazão do Rio Xingu?',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Você sabia que que a Norte Energia construiu e mantém o Centro de Monitoramento Remoto da FUNAI...',
            type: 'single',
            options: ['Sim', 'Não']
        },
        {
            text: 'Desde 2011, já foram plantadas 1,5 milhão de mudas nativas... Você considera essa ação:',
            type: 'single',
            options: ['Muito importante', 'Importante', 'Neutra', 'Pouco importante']
        },
        {
            text: 'Vou ler algumas frases e gostaria que você indicasse quais são verdadeiras, de acordo com seu conhecimento',
            type: 'multiple',
            options: ['Caso de malária reduzidos em 90%', 'Construídas UBS e Escolas para povos indígenas', 'Instalados sistemas de rádio em aldeias', 'Nenhuma terra indígena foi alagada', 'NS/NR']
        },
        {
            text: 'Quais são suas expectativas para o futuro em relação à usina. Na sua opinião é muito provável, provável ou improvável que vai continuar trazendo benefícios:',
            type: 'single',
            options: ['Muito provável', 'Provável', 'Improvável', 'NS/NR']
        }
    ]

    // 2. Insert Questions
    for (const [index, q] of questions.entries()) {
        const { data: questionData, error: qError } = await supabase
            .from('questions')
            .insert({
                survey_id: surveyId,
                text: q.text,
                type: q.type,
                order_index: index + 1,
                is_required: true
            })
            .select()
            .single()

        if (qError) {
            console.error('Error creating question:', qError)
            continue
        }

        // 3. Insert Options
        if (q.options && q.options.length > 0) {
            const optionsToInsert = q.options.map((opt, i) => ({
                question_id: questionData.id,
                label: opt,
                value: opt,
                order_index: i + 1
            }))

            const { error: oError } = await supabase
                .from('question_options')
                .insert(optionsToInsert)

            if (oError) console.error('Error creating options:', oError)
        }
    }

    return NextResponse.json({ success: true, surveyId })
}
