import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import type { Expression } from "../types/Expression"
import type { ExpressionEdit } from '../types/ExpressionEdit'
import { editExpression } from "../utils/editExpression"
import { validateExpression } from "../utils/validateExpression"

export function useExpressionInput(onValidExpression: (source: string, parsedExpression: Expression) => void,) {
    const [value, setValue] = useState('')
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    function updateValue(nextValue: string) {
        setValue(nextValue)
        setError(null)
    }

    function applyEdit(edit: ExpressionEdit) {
        const input = inputRef.current
        if (!input) {
            return
        }

        const start = input.selectionStart ?? value.length
        const end = input.selectionEnd ?? start
        const result = editExpression(value, start, end, edit)

        if (result.value !== value) {
            flushSync(() => updateValue(result.value))
        }

        input.focus({ preventScroll: true })
        input.setSelectionRange(result.caret, result.caret)
    }

    function submit() {
        const input = inputRef.current
        input?.focus({ preventScroll: true })
        input?.form?.requestSubmit()
    }

    function submitExpression() {
        const result = validateExpression(value)

        if (!result.valid) {
            setError(value.trim() ? result.error : 'Enter a function.')
            return
        }

        onValidExpression(value.trim(), result.expression)
        updateValue('')
    }

    return { value, error, updateValue, inputRef, applyEdit, submit, submitExpression }
}