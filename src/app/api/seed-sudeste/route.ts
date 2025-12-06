import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    // 1. Create Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
            title: 'Perfil Região Sudeste',
            description: 'Pesquisa detalhada sobre hábitos, cultura e dados demográficos da Região Sudeste.',
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
            options: opts(['São Paulo (SP)', 'Rio de Janeiro (RJ)', 'Minas Gerais (MG)', 'Espírito Santo (ES)'])
        },
        {
            text: '2. Qual é a sua cidade de residência?',
            type: 'text'
        },
        {
            text: '3. Como você caracteriza a localização da sua moradia?',
            type: 'single',
            options: opts([
                'Capital (SP, Rio, BH, Vitória)',
                'Região Metropolitana / Grande Capital (ex: ABC Paulista, Baixada Fluminense, Contagem, Vila Velha)',
                'Cidade do Interior - Polo Regional (ex: Campinas, Ribeirão Preto, Juiz de Fora)',
                'Cidade do Interior - Médio/Pequeno porte',
                'Litoral (Fora das capitais)',
                'Zona Rural'
            ])
        },
        {
            text: '4. Qual a sua origem geográfica?',
            type: 'single',
            options: opts([
                'Nasci no estado onde moro atualmente.',
                'Nasci em outro estado do Sudeste.',
                'Nasci na região Nordeste.',
                'Nasci na região Sul.',
                'Nasci em outras regiões (Norte/Centro-Oeste).',
                'Sou estrangeiro.'
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
            options: opts(['Feminino', 'Masculino', 'Não-binário / Outro / Prefiro não responder'])
        },
        {
            text: '7. Qual a sua cor ou raça? (Classificação IBGE)',
            type: 'single',
            options: opts(['Branca', 'Preta', 'Parda', 'Amarela (Forte presença em SP)', 'Indígena', 'Prefiro não declarar'])
        },

        // Bloco 2: Perfil Socioeconômico
        {
            text: '8. Qual o seu grau de instrução?',
            type: 'single',
            options: opts([
                'Fundamental / Médio (Incompleto ou Completo)',
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
                'Acima de R$ 20.000,00 (Classe A)'
            ])
        },
        {
            text: '10. Qual sua ocupação principal no momento?',
            type: 'single',
            options: opts([
                'Setor de Serviços / Comércio.',
                'Indústria / Corporativo (Escritórios).',
                'Setor Público.',
                'Agronegócio (Forte no interior de SP e MG).',
                'Empreendedor / Autônomo / Gig Economy (Motoristas app, entregadores).',
                'Estudante / Aposentado / Do lar.'
            ])
        },

        // Bloco 3: Identidade Cultural e Ritmo de Vida
        {
            text: '11. Qual a sua relação com a ancestralidade familiar?',
            type: 'single',
            options: opts([
                'Descendente de imigrantes europeus (Italianos, Portugueses, Espanhóis).',
                'Descendente de imigrantes asiáticos (Japoneses, Libaneses, Chineses).',
                'Descendente de migrantes nordestinos.',
                'Identidade Afro-brasileira (Forte influência no RJ, MG e SP).',
                'Raízes "Caipiras" / Interioranas.',
                'Mestiça / Brasileira Geral.'
            ])
        },
        {
            text: '12. Como você define o ritmo da sua cidade/vida?',
            type: 'single',
            options: opts([
                'Acelerado/Frenético ("Não para nunca" - Típico SP).',
                'Descontraído/Litorâneo (Estilo Carioca/Capixaba).',
                'Tranquilo/Hospitaleiro (Estilo Mineiro/Interior).',
                'Equilibrado.'
            ])
        },
        {
            text: '13. Em relação à linguagem, quais expressões fazem parte do seu dia a dia?',
            type: 'single',
            options: opts([
                '"Mano", "Meu", "Da hora" (Paulistano).',
                '"Mermão", "Caraca", Chiado no \'S\' (Carioca).',
                '"Uai", "Trem", "Arreda" (Mineiro).',
                '"Pocar", "Massa" (Capixaba).',
                'Sotaque neutro ou misto.'
            ])
        },
        {
            text: '14. Quais grandes eventos ou festas populares você costuma frequentar?',
            type: 'multiple',
            options: opts([
                'Carnaval de Rua (Blocos de Rio, SP ou BH).',
                'Desfiles de Escola de Samba (Sambódromo).',
                'Festas Juninas / Quermesses (Muito fortes em toda a região).',
                'Rodeios / Festas de Peão (Barretos, Jaguariúna, Interior).',
                'Eventos Culturais/Festivais de Música (Rock in Rio, Lollapalooza, The Town).',
                'Bienais / Eventos de Negócios.',
                'Não costumo frequentar grandes eventos.'
            ])
        },
        {
            text: '15. Qual é o seu "lugar de encontro" preferido com amigos (Happy Hour)?',
            type: 'single',
            options: opts([
                'Boteco / Barzinho de calçada (Cultura muito forte em BH e RJ).',
                'Padarias / Cafés (Tradicional em SP).',
                'Shopping Center.',
                'Casa de amigos / Churrasco na laje ou varanda.',
                'Baladas / Casas Noturnas.'
            ])
        },
        {
            text: '16. O quanto você se considera uma pessoa urbana/cosmopolita? (1=Prefiro o campo, 5=Amo cidade grande)',
            type: 'likert'
            // Default 1-5
        },

        // Bloco 4: Religião e Crenças
        {
            text: '17. Qual é a sua religião ou crença?',
            type: 'single',
            options: opts([
                'Católica Apostólica Romana.',
                'Evangélica / Protestante / Neopentecostal.',
                'Espírita (Kardecista).',
                'Umbanda / Candomblé.',
                'Outras (Budismo, Judaísmo, etc. - comuns nas capitais).',
                'Sem religião (Ateu/Agnóstico).'
            ])
        },
        {
            text: '18. Com que frequência você frequenta templos, cultos ou terreiros?',
            type: 'single',
            options: opts([
                'Semanalmente.',
                'Mensalmente.',
                'Apenas em datas especiais.',
                'Nunca.'
            ])
        },

        // Bloco 5: Consumo, Lazer e Gastronomia
        {
            text: '19. O que você prioriza no seu lazer de fim de semana?',
            type: 'multiple',
            options: opts([
                'Praia (Litoral Paulista, Fluminense ou Capixaba).',
                'Gastronomia (Restaurantes, Pizzarias).',
                'Cultura (Museus, Teatros, Cinemas).',
                'Parques Urbanos (Ibirapuera, Aterro do Flamengo, Parque das Mangabeiras).',
                'Ficar em casa (Streaming/Descanso).'
            ])
        },
        // Q20 Split Matrix (Likert 1-5)
        { text: '20.1. Com que frequência você consome: Pizza (especialmente aos finais de semana)? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.2. Com que frequência você consome: Pão de Queijo / Café? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.3. Com que frequência você consome: Feijoada (Quartas ou Sábados)? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.4. Com que frequência você consome: Comida de Boteco (Pastel, Bolinho de Bacalhau, Torresmo)? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.5. Com que frequência você consome: Moqueca (Capixaba ou Baiana)? (1=Nunca, 5=Sempre)', type: 'likert' },
        { text: '20.6. Com que frequência você consome: Comida Japonesa/Asiática? (1=Nunca, 5=Sempre)', type: 'likert' },

        {
            text: '21. Qual é o seu estilo de viagem curta (feriados) preferido na região?',
            type: 'single',
            options: opts([
                'Litoral Norte de SP / Região dos Lagos RJ / Litoral ES.',
                'Serra / Inverno (Campos do Jordão, Petrópolis, Monte Verde).',
                'Cidades Históricas (Ouro Preto, Tiradentes, Paraty).',
                'Resorts e Hotéis Fazenda.',
                'Não costumo viajar.'
            ])
        },
        {
            text: '22. Qual o seu interesse por eventos culturais internacionais (Shows, Exposições)? (1=Nenhum, 5=Muito)',
            type: 'likert'
        },
        {
            text: '23. Como você lida com compras de vestuário e moda?',
            type: 'single',
            options: opts([
                'Compro em grandes Shoppings.',
                'Compro em polos de comércio popular (Brás, Bom Retiro, Saara, Barro Preto).',
                'Compro online.',
                'Compro em boutiques de bairro.'
            ])
        },

        // Bloco 6: Mobilidade, Tecnologia e Serviços
        {
            text: '24. Qual meio de transporte você utiliza para trabalhar/estudar?',
            type: 'single',
            options: opts([
                'Carro próprio.',
                'Metrô / Trem (Muito relevante em SP e RJ).',
                'Ônibus.',
                'Aplicativos de transporte.',
                'Trabalho 100% Home Office (sem deslocamento).'
            ])
        },
        {
            text: '25. Quanto tempo você gasta, em média, no deslocamento diário (ida e volta)?',
            type: 'single',
            options: opts([
                'Menos de 30 minutos.',
                'Entre 30 min e 1 hora.',
                'Entre 1h e 2 horas.',
                'Mais de 2 horas (Comum em grandes metrópoles).'
            ])
        },
        {
            text: '26. Você utiliza bancos digitais como conta principal?',
            type: 'single',
            options: opts([
                'Sim, 100% digital.',
                'Misto.',
                'Não, apenas bancões tradicionais.'
            ])
        },
        {
            text: '27. Com qual frequência você utiliza serviços de Delivery (iFood, Rappi, Zé Delivery)?',
            type: 'single',
            options: opts([
                'Quase todos os dias.',
                '2 a 3 vezes por semana.',
                'Apenas fins de semana.',
                'Raramente.'
            ])
        },

        // Bloco 7: Mídia e Comportamento Social
        {
            text: '28. Qual rede social consome a maior parte do seu tempo?',
            type: 'single',
            options: opts(['Instagram.', 'TikTok.', 'LinkedIn (Forte uso corporativo em SP).', 'Twitter / X.', 'Facebook.'])
        },
        {
            text: '29. Onde você consome notícias locais?',
            type: 'single',
            options: opts([
                'Portais de grandes jornais (Folha, Estadão, O Globo).',
                'TV Aberta (Jornais locais da hora do almoço/noite).',
                'Redes Sociais / Influenciadores.',
                'Rádio (BandNews, CBN - trânsito e notícias).'
            ])
        },
        {
            text: '30. Qual é a sua percepção sobre a violência urbana na sua cidade?',
            type: 'single',
            options: opts([
                'É o meu maior medo/problema atual.',
                'Preocupa, mas tomo precauções e sigo a vida.',
                'Sinto-me relativamente seguro onde moro.'
            ])
        },
        {
            text: '31. Você costuma frequentar espaços culturais públicos (SESC, Centros Culturais, Museus)?',
            type: 'single',
            options: opts([
                'Sim, com frequência (O SESC é muito forte em SP/RJ).',
                'Ocasionalmente.',
                'Não.'
            ])
        },

        // Bloco 8: Visão de Mundo e Pertencimento
        {
            text: '32. O quanto você se sente integrado à cultura do seu estado? (1=Não me identifico, 10=Muito orgulho)',
            type: 'likert',
            customScale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
            text: '33. Você acredita que sua cidade oferece tudo o que você precisa para crescer profissionalmente?',
            type: 'single',
            options: opts([
                'Sim, estou no melhor lugar para minha carreira.',
                'Sim, mas o custo de vida atrapalha.',
                'Não, pretendo mudar para uma cidade maior (Capital).',
                'Não, pretendo mudar para o interior/litoral em busca de qualidade de vida (Êxodo urbano).'
            ])
        },
        {
            text: '34. Como você descreveria o maior desafio de viver no Sudeste hoje?',
            type: 'single',
            options: opts([
                'Custo de vida / Moradia cara.',
                'Segurança Pública.',
                'Trânsito / Mobilidade Urbana.',
                'Estresse / Qualidade de vida.',
                'Desigualdade social visível.'
            ])
        },
        {
            text: '35. Na sua opinião, o que diferencia o morador do Sudeste das outras regiões?',
            type: 'text'
        },
        {
            text: '36. Qual marca ou empresa é "a cara" do seu estado?',
            type: 'text'
        },
        {
            text: '37. Qual é o seu "refúgio" (lugar para relaxar) favorito dentro do seu estado?',
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
