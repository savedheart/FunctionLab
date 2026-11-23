import { useRef, useState } from 'react'
import { flushSync } from "react-dom"

import { editExpression, type ExpressionEdit } from "../utils/editExpression.ts"

export function useExpressionInput() {
    const [value, setValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    function applyEdit(edit: ExpressionEdit) {
        const input = inputRef.current
        if (!input) {
            return
        }

        const start = input.selectionStart ?? input.value.length
        const end = input.selectionEnd ?? start
        const result = editExpression(input.value, start, end, edit)

        if (result.value !== input.value) {
            flushSync(() => setValue(result.value))
        }

        input.focus({ preventScroll: true })
        input.setSelectionRange(result.caret, result.caret)
    }

    function submit() {
        const input = inputRef.current
        input?.focus({ preventScroll: true })
        input?.form?.requestSubmit()
    }

    return { value, setValue, inputRef, applyEdit, submit }
}