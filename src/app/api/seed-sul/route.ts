import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    // 1. Create Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
            title: 'Perfil Região Sul',
            description: 'Pesquisa detalhada sobre hábitos, cultura e dados demográficos da Região Sul.',
            status: 'published',
            points_per_response: 100
        })
        .select()
        .single()

    if (surveyError) return NextResponse.json({ error: surveyError }, { status: 500 })

    const surveyId = survey.id

    // Helper to format options
    const opts = (labels: string[]) => labels.map((l, i) => ({ label: l, value: l }))

    // Questions Data
    const questions = [
        // Bloco 1: Geodemografia
        {
            text: '1. Em qual estado você reside atualmente?',
            type: 'single',
            options: opts(['Rio Grande do Sul (RS)', 'Santa Catarina (SC)', 'Paraná (PR)'])
        },
        {
            text: '2. Qual é a sua cidade de residência?',
            type: 'text'
        },
        {
            text: '3. Como você caracteriza a localização da sua moradia?',
            type: 'single',
            options: opts([
                'Capital (Porto Alegre, Florianópolis ou Curitiba)',
                'Região Metropolitana da Capital',
                'Cidade do Interior - Grande porte (ex: Caxias do Sul, Joinville, Londrina)',
                'Cidade do Interior - Pequeno/Médio porte',
                'Litoral',
                'Zona Rural'
            ])
        },
        {
            text: '4. Há quanto tempo você mora na Região Sul?',
            type: 'single',
            options: opts([
                'Nasci aqui e sempre morei.',
                'Moro há mais de 10 anos.',
                'Moro entre 2 a 10 anos.',
                'Moro há menos de 2 anos (recém-chegado).'
            ])
        },
        {
            text: '5. Qual sua faixa etária?',
            type: 'single',
            options: opts(['18 a 24 anos', '25 a 34 anos', '35 a 44 anos', '45 a 59 anos', '60 anos ou mais'])
        },
        {
            text: '6. Identidade de Gênero:',
            type: 'single',
            options: opts(['Feminino', 'Masculino', 'Não-binário', 'Outro / Prefiro não responder'])
        },
        {
            text: '7. Qual a sua cor ou raça? (Classificação IBGE)',
            type: 'single',
            options: opts(['Branca', 'Preta', 'Parda', 'Amarela (Origem asiática)', 'Indígena', 'Prefiro não declarar'])
        },

        // Bloco 2: Perfil Socioeconômico
        {
            text: '8. Qual o seu grau de instrução?',
            type: 'single',
            options: opts([
                'Fundamental (Incompleto ou Completo)',
                'Médio (Incompleto ou Completo)',
                'Superior (Incompleto ou Completo)',
                'Pós-graduação / MBA / Mestrado / Doutorado'
            ])
        },
        {
            text: '9. Qual a renda familiar mensal aproximada?',
            type: 'single',
            options: opts([
                'Até R$ 2.000,00',
                'De R$ 2.001,00 a R$ 5.000,00',
                'De R$ 5.001,00 a R$ 10.000,00',
                'De R$ 10.001,00 a R$ 20.000,00',
                'Acima de R$ 20.000,00'
            ])
        },
        {
            text: '10. Qual sua ocupação principal no momento?',
            type: 'single',
            options: opts([
                'Setor Privado (Indústria/Comércio/Serviços)',
                'Setor Público',
                'Agronegócio / Produtor Rural',
                'Empreendedor / Autônomo',
                'Profissional de Tecnologia / Home Office',
                'Estudante / Aposentado / Do lar'
            ])
        },

        // Bloco 3: Identidade Cultural e Tradições
        {
            text: '11. Qual a sua relação com a ancestralidade e imigração?',
            type: 'single',
            options: opts([
                'Forte influência Italiana.',
                'Forte influência Alemã.',
                'Forte influência Eslava (Polonesa/Ucraniana).',
                'Forte influência Açoriana/Portuguesa.',
                'Identidade Afro-brasileira ou Indígena.',
                'Mestiça / Brasileira (sem ascendência europeia predominante).'
            ])
        },
        {
            text: '12. Com que frequência você consome Chimarrão ou Tererê?',
            type: 'single',
            options: opts([
                'Chimarrão diariamente.',
                'Tererê frequentemente.',
                'Apenas socialmente / Finais de semana.',
                'Não consumo / Prefiro café ou chá.'
            ])
        },
        {
            text: '13. Em relação à linguagem, você utiliza termos regionais (ex: "Bah/Tchê", "Vina/Piá", "Mofas com a pomba")?',
            type: 'single',
            options: opts([
                'Sim, uso gírias locais o tempo todo.',
                'Uso moderadamente.',
                'Não uso, tenho um sotaque neutro ou de outra região.'
            ])
        },
        {
            text: '14. Você frequenta festas típicas da região Sul? (Selecione as que frequentou nos últimos 2 anos)',
            type: 'multiple',
            options: opts([
                'Oktoberfest (Blumenau, Santa Cruz, etc.)',
                'Festas da Uva / Vinho / Colono',
                'Rodeios Crioulos / Festejos Farroupilhas',
                'Festival de Curitiba / Eventos Culturais Urbanos',
                'Não costumo frequentar festas regionais.'
            ])
        },
        {
            text: '15. Você participa ou frequenta algum Centro de Tradições Gaúchas (CTG) ou entidade tradicionalista similar?',
            type: 'single',
            options: opts([
                'Sim, sou membro ativo.',
                'Sim, participo eventualmente.',
                'Já participei, mas não participo mais.',
                'Nunca participei.'
            ])
        },
        {
            text: '16. O quanto você valoriza a preservação das tradições culturais da sua região? (1=Pouco, 5=Muito)',
            type: 'likert'
            // Default 1-5
        },

        // Bloco 4: Religião e Crenças
        {
            text: '17. Qual é a sua religião ou crença?',
            type: 'single',
            options: opts([
                'Católica Apostólica Romana',
                'Evangélica / Protestante',
                'Luterana (Comum nas áreas de imigração alemã)',
                'Espírita',
                'Umbanda / Candomblé / Matriz Africana',
                'Outras',
                'Sem religião (Ateu/Agnóstico)'
            ])
        },
        {
            text: '18. Com que frequência você participa de atividades religiosas ou espirituais?',
            type: 'single',
            options: opts([
                'Diariamente ou semanalmente.',
                'Mensalmente.',
                'Apenas em datas especiais.',
                'Raramente ou nunca.'
            ])
        },

        // Bloco 5: Consumo, Lazer e Gastronomia
        {
            text: '19. Quais atividades de lazer você pratica regularmente?',
            type: 'multiple',
            options: opts([
                'Assistir TV / Streaming / Leitura.',
                'Praticar esportes / Atividades ao ar livre (Trilhas, Pesca).',
                'Videogame / Jogos eletrônicos.',
                'Bares, restaurantes e vida noturna.',
                'Rodas de chimarrão com amigos/família.',
                'Visitar vinícolas e rotas gastronômicas.'
            ])
        },
        // Q20 Split Matrix (Likert 1-5)
        { text: '20.1. Com que frequência você consome: Churrasco? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.2. Com que frequência você consome: Barreado (Típico PR)? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.3. Com que frequência você consome: Marreco Recheado / Cuca (Típico SC/RS)? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.4. Com que frequência você consome: Pierogi / Varenyky (Típico PR/SC)? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.5. Com que frequência você consome: Polenta com molho? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.6. Com que frequência você consome: Pinhão (Sazonal)? (1=Nunca, 5=Sempre)', type: 'likert' },

        {
            text: '21. Qual é o seu destino preferido para turismo de fim de semana?',
            type: 'single',
            options: opts([
                'Serra (Gramado, Canela, Serra Catarinense).',
                'Litoral (Praias de SC, Litoral Norte/Sul do RS, Ilha do Mel).',
                'Turismo Rural / Vinícolas.',
                'Grandes Centros Urbanos.',
                'Fico em casa.'
            ])
        },
        {
            text: '22. Qual é o seu interesse por turismo de experiência (enoturismo, agroturismo, turismo cultural)? (1=Nenhum, 5=Muito)',
            type: 'likert'
        },
        {
            text: '23. Como o inverno/clima frio da região impacta seu orçamento anual?',
            type: 'single',
            options: opts([
                'Impacto Alto (Gastos elevados com vestuário, energia, gás).',
                'Impacto Médio.',
                'Impacto Baixo.'
            ])
        },
        {
            text: '24. Onde você costuma realizar compras de vestuário?',
            type: 'single',
            options: opts([
                'Shoppings Centers.',
                'Comércio de rua local.',
                'Internet / E-commerce.',
                'Direto de fábrica (Malharias).'
            ])
        },

        // Bloco 6: Tecnologia e Serviços
        {
            text: '25. Qual meio de transporte você utiliza com mais frequência?',
            type: 'single',
            options: opts(['Carro próprio.', 'Transporte Público.', 'Aplicativos (Uber/99).', 'Bicicleta / A pé.'])
        },
        {
            text: '26. Você utiliza bancos digitais como sua conta principal?',
            type: 'single',
            options: opts(['Sim, sou 100% digital.', 'Misto (Digital + Tradicional).', 'Não, uso apenas bancos tradicionais/cooperativas.'])
        },
        {
            text: '27. Com qual frequência você pede comida por aplicativo (Delivery)?',
            type: 'single',
            options: opts(['Mais de 3 vezes por semana.', '1 a 2 vezes por semana.', 'Quinzenalmente/Mensalmente ou Nunca.'])
        },

        // Bloco 7: Mídia e Comportamento Social
        {
            text: '28. Qual rede social você mais utiliza atualmente?',
            type: 'single',
            options: opts(['Instagram.', 'TikTok.', 'LinkedIn.', 'Twitter / X.', 'Facebook.'])
        },
        {
            text: '29. Você costuma ouvir Rádio (AM/FM)?',
            type: 'single',
            options: opts(['Sim, diariamente.', 'Sim, mas apenas no carro.', 'Não.'])
        },
        {
            text: '30. Qual é o seu nível de preocupação com a segurança pública na sua cidade?',
            type: 'single',
            options: opts(['Muito preocupado.', 'Moderadamente preocupado.', 'Pouco preocupado.'])
        },
        {
            text: '31. Você separa o lixo para reciclagem?',
            type: 'single',
            options: opts(['Sim, rigorosamente.', 'Sim, às vezes.', 'Não.'])
        },

        // Bloco 8: Valores e Visão de Mundo
        {
            text: '32. O quanto você diria que o "orgulho local/bairrismo" é forte na sua cidade? (1=Fraco a 10=Muito Forte)',
            type: 'likert',
            customScale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
            text: '33. Você considera que sua região oferece boas oportunidades de crescimento profissional?',
            type: 'single',
            options: opts([
                'Sim, plenamente.',
                'Sim, mas apenas em setores específicos.',
                'Não, sinto que está estagnada.',
                'Não, pretendo me mudar.'
            ])
        },
        {
            text: '34. Como você descreveria o estilo de vida do sulista comparado ao resto do Brasil?',
            type: 'single',
            options: opts([
                'Mais reservado e focado no trabalho.',
                'Mais tradicional e familiar.',
                'Mais acelerado e urbano.',
                'Igual a qualquer outra região.'
            ])
        },
        {
            text: '35. Na sua opinião, o que poderia ser feito para fortalecer a cultura regional?',
            type: 'text'
        },
        {
            text: '36. Qual é a marca (empresa) que melhor representa o seu estado ou a Região Sul para você?',
            type: 'text'
        },
        {
            text: '37. Se você tivesse que indicar uma única experiência cultural imperdível na sua cidade, qual seria?',
            type: 'text'
        }
    ]

    // 2. Insert Questions & Options
    for (const [index, q] of questions.entries()) {
        const { data: questionData, error: qError } = await supabase
            .from('questions')
            .insert({
                survey_id: surveyId,
                text: q.text,
                type: q.type,
                order_index: index + 1,
                is_required: true,
            })
            .select()
            .single()

        if (qError) {
            console.error('Error creating question:', qError)
            continue
        }

        // Insert Options (Single/Multiple/Custom Likert)
        if (q.options) {
            // Standard options
            const optionsToInsert = q.options.map((opt, i) => ({
                question_id: questionData.id,
                label: opt.label,
                value: opt.value,
                order_index: i + 1
            }))
            await supabase.from('question_options').insert(optionsToInsert)

        } else if (q.customScale) {
            // Custom scale (1-10)
            const optionsToInsert = q.customScale.map((val, i) => ({
                question_id: questionData.id,
                label: val.toString(),
                value: val.toString(),
                order_index: i + 1
            }))
            await supabase.from('question_options').insert(optionsToInsert)
        }
    }

    return NextResponse.json({ success: true, surveyId })
}
