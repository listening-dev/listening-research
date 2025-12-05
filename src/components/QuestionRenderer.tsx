'use client'

import { useState } from 'react'

type Question = {
    id: string
    text: string
    type: 'yes_no' | 'single' | 'multiple' | 'likert' | 'ranking' | 'text'
    is_required: boolean
    options?: { id: string; label: string; value: string }[]
}

export default function QuestionRenderer({ question, onChange }: { question: Question, onChange: (value: any) => void }) {
    const [value, setValue] = useState<any>(null)

    const handleChange = (val: any) => {
        setValue(val)
        onChange(val)
    }

    switch (question.type) {
        case 'text':
            return (
                <textarea
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    rows={3}
                    onChange={(e) => handleChange({ value_text: e.target.value })}
                    required={question.is_required}
                />
            )
        case 'yes_no':
            return (
                <div className="flex gap-4">
                    {['Sim', 'Não'].map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={question.id}
                                value={opt}
                                onChange={() => handleChange({ value_text: opt })}
                                required={question.is_required}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            )
        case 'single':
            return (
                <div className="space-y-2">
                    {question.options?.map((opt) => (
                        <label key={opt.id} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={question.id}
                                value={opt.value}
                                onChange={() => handleChange({ option_id: opt.id })}
                                required={question.is_required}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )
        case 'multiple':
            return (
                <div className="space-y-2">
                    {question.options?.map((opt) => (
                        <label key={opt.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={opt.value}
                                onChange={(e) => {
                                    const current = value?.option_ids || []
                                    const newValue = e.target.checked
                                        ? [...current, opt.id]
                                        : current.filter((id: string) => id !== opt.id)
                                    handleChange({ option_ids: newValue })
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )
        case 'likert':
            return (
                <div className="flex justify-between max-w-xs">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <label key={rating} className="flex flex-col items-center gap-1">
                            <input
                                type="radio"
                                name={question.id}
                                value={rating}
                                onChange={() => handleChange({ value_numeric: rating })}
                                required={question.is_required}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-xs text-gray-500">{rating}</span>
                        </label>
                    ))}
                </div>
            )
        case 'ranking':
            // Simplified ranking: just text input for now or select order
            // For MVP, let's use a simple list of selects or just text instructions
            // Ideally drag and drop, but that requires dnd-kit or similar.
            // Let's implement a simple numbered input for each option.
            return (
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Numere as opções de 1 a {question.options?.length}</p>
                    {question.options?.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max={question.options?.length}
                                className="w-16 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(e) => {
                                    const current = value?.ranking || {}
                                    handleChange({ ranking: { ...current, [opt.id]: parseInt(e.target.value) } })
                                }}
                            />
                            <span>{opt.label}</span>
                        </div>
                    ))}
                </div>
            )
        default:
            return null
    }
}
