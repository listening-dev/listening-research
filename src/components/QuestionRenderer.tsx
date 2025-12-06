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
                        <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${value?.value_text === opt
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                            }`}>
                            <input
                                type="radio"
                                name={question.id}
                                value={opt}
                                onChange={() => handleChange({ value_text: opt })}
                                required={question.is_required}
                                className="sr-only"
                            />
                            {value?.value_text === opt && <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2" />}
                            {opt}
                        </label>
                    ))}
                </div>
            )
        case 'single':
            return (
                <div className="space-y-3">
                    {question.options?.map((opt) => (
                        <label key={opt.id} className={`flex items-center w-full p-4 rounded-lg border cursor-pointer transition-all ${value?.option_id === opt.id
                            ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                            }`}>
                            <input
                                type="radio"
                                name={question.id}
                                value={opt.value}
                                onChange={() => handleChange({ option_id: opt.id })}
                                required={question.is_required}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className={`ml-3 text-sm ${value?.option_id === opt.id ? 'font-medium text-indigo-900' : 'text-gray-700'}`}>
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            )
        case 'multiple':
            return (
                <div className="space-y-3">
                    {question.options?.map((opt) => {
                        const isSelected = (value?.option_ids || []).includes(opt.id)
                        return (
                            <label key={opt.id} className={`flex items-center w-full p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                }`}>
                                <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={isSelected}
                                    onChange={(e) => {
                                        const current = value?.option_ids || []
                                        const newValue = e.target.checked
                                            ? [...current, opt.id]
                                            : current.filter((id: string) => id !== opt.id)
                                        handleChange({ option_ids: newValue })
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <span className={`ml-3 text-sm ${isSelected ? 'font-medium text-indigo-900' : 'text-gray-700'}`}>
                                    {opt.label}
                                </span>
                            </label>
                        )
                    })}
                </div>
            )
        case 'likert':
            const likertOptions = question.options?.length
                ? question.options.map(opt => ({ value: parseInt(opt.value), label: opt.label }))
                : [1, 2, 3, 4, 5].map(v => ({ value: v, label: v.toString() }))

            return (
                <div className="flex justify-between items-end gap-1 px-1">
                    {likertOptions.map((opt) => (
                        <label key={opt.value} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${value?.value_numeric === opt.value
                                ? 'border-indigo-600 bg-indigo-600 text-white scale-110 shadow-md'
                                : 'border-gray-300 text-gray-400 group-hover:border-indigo-400 group-hover:text-indigo-500'
                                }`}>
                                <span className="text-sm font-semibold">{opt.value}</span>
                            </div>
                            <input
                                type="radio"
                                name={question.id}
                                value={opt.value}
                                onChange={() => handleChange({ value_numeric: opt.value })}
                                required={question.is_required}
                                className="sr-only"
                            />
                            {/* Hide label on small screens if standard 1-5, keep for custom text */}
                            <span className={`text-[10px] text-center max-w-[60px] line-clamp-2 leading-tight ${value?.value_numeric === opt.value ? 'text-indigo-700 font-medium' : 'text-gray-500'
                                }`}>
                                {opt.label !== opt.value.toString() ? opt.label : ''}
                            </span>
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
