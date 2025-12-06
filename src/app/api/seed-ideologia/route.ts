import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    // 1. Create Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
            title: 'Pesquisa de Ideologia',
            description: 'Você acredita que... (Resposta em escala de 6 pontos)',
            status: 'published',
            points_per_response: 50 // Defined arbitrary points, can be changed
        })
        .select()
        .single()

    if (surveyError) return NextResponse.json({ error: surveyError }, { status: 500 })

    const surveyId = survey.id

    // 6-point scale options
    const scaleOptions = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' }
    ]

    // Questions Data
    const questions = [
        // Econômico/Administrativo
        { text: 'Mérito próprio é suficiente para ser bem-sucedido no Brasil.', type: 'likert' },
        { text: 'O mundo era menos chato antes do “politicamente correto”.', type: 'likert' },
        { text: 'Serviços como saúde e educação universal de qualidade devem ser oferecidos pelo governo.', type: 'likert' },
        { text: 'O Mercado é um administrador mais honesto que o governo.', type: 'likert' },
        { text: 'Quanto menos o governo intervir na sociedade, melhor a situação do país.', type: 'likert' },
        { text: 'A equidade social é mais importante que a liberdade econômica.', type: 'likert' },
        { text: 'Criminosos deveriam ser punidos com a morte.', type: 'likert' },
        { text: 'O governo deve regular o Mercado para promover o interesse público.', type: 'likert' },

        // Cultural/Social
        { text: 'O aborto deveria ser legalizado.', type: 'likert' },
        { text: 'A legalização e regulamentação do uso de drogas atualmente ilícitas trará resultados positivos.', type: 'likert' },
        { text: 'A luta das minorias (LGBT, étnicas, sociais e afins) pelos seus direitos é legítima.', type: 'likert' },
        { text: 'Somente casais heterossexuais devem poder adotar.', type: 'likert' },
        { text: 'A separação entre a religião e as decisões legais e políticas é essencial.', type: 'likert' }
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

        // 3. Insert Scale Options for Likert
        const optionsToInsert = scaleOptions.map((opt, i) => ({
            question_id: questionData.id,
            label: opt.label,
            value: opt.value,
            order_index: i + 1
        }))

        const { error: oError } = await supabase
            .from('question_options')
            .insert(optionsToInsert)

        if (oError) console.error('Error creating options:', oError)
    }

    return NextResponse.json({ success: true, surveyId })
}
