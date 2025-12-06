import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    // 1. Create Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
            title: 'Perfil Região Nordeste',
            description: 'Pesquisa sobre identidade, consumo e desenvolvimento da Região Nordeste.',
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
        // Bloco 1: Geodemografia e Localização
        {
            text: '1. Em qual estado você reside atualmente?',
            type: 'single',
            options: opts([
                'Alagoas (AL)',
                'Bahia (BA)',
                'Ceará (CE)',
                'Maranhão (MA)',
                'Paraíba (PB)',
                'Pernambuco (PE)',
                'Piauí (PI)',
                'Rio Grande do Norte (RN)',
                'Sergipe (SE)'
            ])
        },
        {
            text: '2. Qual é a sua cidade de residência?',
            type: 'text'
        },
        {
            text: '3. Como você caracteriza a localização da sua moradia?',
            type: 'single',
            options: opts([
                'Capital.',
                'Região Metropolitana da Capital.',
                'Cidade do Interior - Polo Regional (Médio/Grande porte).',
                'Cidade do Interior - Pequeno porte.',
                'Região Litorânea (Fora da capital).',
                'Zona Rural.'
            ])
        },
        {
            text: '4. Qual o seu contexto de moradia na região?',
            type: 'single',
            options: opts([
                'Sempre residi no meu estado atual.',
                'Sou de outro estado do Nordeste e mudei-me para o atual.',
                'Sou de outra região do Brasil (Sul, Sudeste, Norte, Centro-Oeste).',
                'Retornei ao Nordeste após morar em outra região.'
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
            text: '7. Qual a sua cor ou raça? (Autodeclaração conforme IBGE)',
            type: 'single',
            options: opts(['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Prefiro não declarar'])
        },

        // Bloco 2: Perfil Socioeconômico e Profissional
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
                'Acima de R$ 20.000,00'
            ])
        },
        {
            text: '10. Qual sua área de atuação principal?',
            type: 'single',
            options: opts([
                'Comércio e Varejo.',
                'Turismo e Hospitalidade.',
                'Indústria (Polo Automotivo, Têxtil, Petroquímico, etc.).',
                'Tecnologia e Inovação.',
                'Setor Público / Governamental.',
                'Agronegócio / Agroindústria.',
                'Energia (Eólica, Solar, etc.).',
                'Outros Serviços / Autônomo.'
            ])
        },

        // Bloco 3: Identidade Cultural e Consumo Regional
        {
            text: '11. Como você descreveria sua relação com a cultura local?',
            type: 'single',
            options: opts([
                'Muito forte (Participo ativamente de tradições e eventos).',
                'Moderada (Aprecio, mas não pratico regularmente).',
                'Baixa (Tenho hábitos mais globais/urbanos).'
            ])
        },
        {
            text: '12. Quais eventos do calendário regional você costuma frequentar ou investir recursos?',
            type: 'multiple',
            options: opts([
                'Festas Juninas / São João.',
                'Carnaval.',
                'Festas Religiosas / Padroeiros.',
                'Festivais de Verão / Micaretas.',
                'Eventos Culturais (Cinema, Literatura, Teatro).',
                'Não costumo frequentar grandes eventos regionais.'
            ])
        },
        {
            text: '13. Sobre hábitos alimentares, qual a frequência de consumo da culinária regional no seu dia a dia?',
            type: 'single',
            options: opts([
                'Diariamente (Faz parte da minha rotina básica).',
                'Apenas aos finais de semana ou ocasiões especiais.',
                'Raramente.'
            ])
        },
        {
            text: '14. O quanto a "origem regional" de um produto influencia sua decisão de compra? (1=Não influencia, 5=Dou preferência total)',
            type: 'likert'
            // Default 1-5
        },
        {
            text: '15. Você costuma consumir produtos de artesanato ou moda autoral da região?',
            type: 'single',
            options: opts([
                'Sim, valorizo e compro com frequência.',
                'Compro ocasionalmente (presentes ou decoração).',
                'Não costumo comprar.'
            ])
        },
        {
            text: '16. Qual expressão melhor define o seu estilo de vida atual?',
            type: 'single',
            options: opts([
                'Urbano e conectado.',
                'Tradicional e familiar.',
                'Alternativo e cultural.',
                'Focado em trabalho e carreira.'
            ])
        },

        // Bloco 4: Religião e Crenças
        {
            text: '17. Qual é a sua religião ou crença?',
            type: 'single',
            options: opts([
                'Católica Apostólica Romana.',
                'Evangélica / Protestante.',
                'Religiões de Matriz Africana (Candomblé, Umbanda, etc.).',
                'Espírita.',
                'Outras.',
                'Sem religião (Ateu/Agnóstico).'
            ])
        },
        {
            text: '18. Com que frequência participa de celebrações religiosas?',
            type: 'single',
            options: opts([
                'Regularmente (Semanalmente).',
                'Ocasionalmente.',
                'Apenas em datas festivas.',
                'Nunca.'
            ])
        },

        // Bloco 5: Hábitos de Consumo e Lazer
        {
            text: '19. Qual a sua principal atividade de lazer aos finais de semana?',
            type: 'multiple',
            options: opts([
                'Praias ou atividades litorâneas.',
                'Bares, Restaurantes e Gastronomia.',
                'Shopping Centers e Centros de Compras.',
                'Atividades culturais (Shows, Museus).',
                'Lazer doméstico (Streaming, Jogos, Família).',
                'Ecoturismo ou Turismo Rural.'
            ])
        },
        // Q20 Split Matrix (Likert 1-5)
        { text: '20.1. Com que frequência você consome: Fast Food (Redes Internacionais)? (1=Nunca, 5=Muito Frequentemente)', type: 'likert' },
        { text: '20.2. Com que frequência você consome: Culinária Regional Típica? (1=Nunca, 5=Muito Frequentemente)', type: 'likert' },
        { text: '20.3. Com que frequência você consome: Serviços de Streaming (Vídeo/Música)? (1=Nunca, 5=Muito Frequentemente)', type: 'likert' },
        { text: '20.4. Com que frequência você consome: Compras Online (E-commerce)? (1=Nunca, 5=Muito Frequentemente)', type: 'likert' },
        { text: '20.5. Com que frequência você consome: Delivery de Comida? (1=Nunca, 5=Muito Frequentemente)', type: 'likert' },

        {
            text: '21. Qual seu destino prioritário para viagens de férias curtas?',
            type: 'single',
            options: opts([
                'Destinos dentro do meu próprio estado (Litoral ou Interior).',
                'Outros estados da Região Nordeste.',
                'Outras regiões do Brasil (Sul/Sudeste).',
                'Exterior.'
            ])
        },
        {
            text: '22. Como você avalia a oferta de opções de lazer e cultura na sua cidade?',
            type: 'single',
            options: opts([
                'Excelente, com muitas opções variadas.',
                'Boa, mas poderia melhorar.',
                'Regular.',
                'Insuficiente/Precária.'
            ])
        },
        {
            text: '23. Onde você costuma concentrar suas compras de vestuário e itens pessoais?',
            type: 'single',
            options: opts([
                'Shopping Centers.',
                'Comércio de Rua / Centros da Cidade.',
                'Feiras Livres e Mercados Populares.',
                'Lojas Online.'
            ])
        },

        // Bloco 6: Infraestrutura, Tecnologia e Serviços
        {
            text: '24. Qual meio de transporte você utiliza predominantemente para deslocamento diário?',
            type: 'single',
            options: opts([
                'Veículo próprio (Carro).',
                'Veículo próprio (Motocicleta).',
                'Transporte Público (Ônibus/Metrô/VLT).',
                'Transporte por Aplicativo.',
                'Transporte Alternativo (Vans, Mototáxi).'
            ])
        },
        {
            text: '25. Qual é a sua relação com serviços bancários?',
            type: 'single',
            options: opts([
                'Utilizo bancos digitais como conta principal.',
                'Utilizo bancos tradicionais como conta principal.',
                'Utilizo uma combinação de ambos.',
                'Não possuo conta bancária ativa.'
            ])
        },
        {
            text: '26. Como você avalia a qualidade da conexão de internet na sua residência?',
            type: 'single',
            options: opts([
                'Estável e de alta velocidade (Fibra ótica).',
                'Regular/Instável.',
                'Dependo exclusivamente de dados móveis (3G/4G/5G).'
            ])
        },
        {
            text: '27. Você costuma utilizar serviços digitais para resolver pendências do dia a dia?',
            type: 'single',
            options: opts([
                'Sim, resolvo tudo pelo celular/computador.',
                'Sim, mas ainda prefiro atendimento presencial para algumas coisas.',
                'Não, tenho dificuldades ou prefiro meios físicos.'
            ])
        },

        // Bloco 7: Mídia e Informação
        {
            text: '28. Qual rede social você considera indispensável hoje?',
            type: 'single',
            options: opts(['Instagram.', 'WhatsApp.', 'TikTok.', 'Facebook.', 'X (Twitter) / LinkedIn.'])
        },
        {
            text: '29. Qual sua principal fonte de notícias sobre sua região?',
            type: 'single',
            options: opts([
                'Telejornais locais (TV Aberta).',
                'Portais de notícias na internet e Blogs locais.',
                'Rádio.',
                'Redes Sociais e Grupos de Mensagens.'
            ])
        },
        {
            text: '30. Qual é a sua percepção sobre a segurança pública no seu bairro?',
            type: 'single',
            options: opts([
                'Sinto-me seguro.',
                'Tenho preocupações moderadas.',
                'Sinto-me inseguro.'
            ])
        },
        {
            text: '31. Como você avalia a infraestrutura urbana (água, saneamento, ruas) na sua vizinhança?',
            type: 'single',
            options: opts([
                'Atende plenamente.',
                'Atende parcialmente (falhas ocasionais).',
                'Precária / Necessita de muitas melhorias.'
            ])
        },

        // Bloco 8: Visão de Futuro e Desenvolvimento Regional
        {
            text: '32. Como você avalia o potencial de desenvolvimento econômico da sua cidade nos próximos anos?',
            type: 'single',
            options: opts([
                'Muito otimista (Em crescimento).',
                'Estável.',
                'Pessimista (Estagnado ou em declínio).'
            ])
        },
        {
            text: '33. Você acredita que a Região Nordeste oferece boas oportunidades para sua carreira profissional?',
            type: 'single',
            options: opts([
                'Sim, vejo boas oportunidades aqui.',
                'Sim, mas apenas em setores específicos.',
                'Não, considero buscar oportunidades em outras regiões ou países.'
            ])
        },
        {
            text: '34. Em sua opinião, qual setor deveria receber mais investimento para impulsionar a região?',
            type: 'single',
            options: opts([
                'Educação e Tecnologia.',
                'Turismo e Cultura.',
                'Indústria e Infraestrutura.',
                'Agricultura e Sustentabilidade.'
            ])
        },
        {
            text: '35. O que você considera o maior diferencial positivo de viver no Nordeste?',
            type: 'text'
        },
        {
            text: '36. Qual marca (empresa) você considera um símbolo de sucesso da região?',
            type: 'text'
        },
        {
            text: '37. Qual aspecto da cultura local você gostaria de ver mais valorizado nacionalmente?',
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
            // Custom scale logic if needed (not used in this survey, but standard likert uses default 1-5)
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
