import type { ExpressionEdit } from '../types/ExpressionEdit'

export function editExpression(value: string, start: number, end: number, edit: ExpressionEdit) {
    const before = value.slice(0, start)
    const selection = value.slice(start, end)
    const after = value.slice(end)

    switch (edit.type) {
        case 'insert':
            return {
                value: before + edit.text + after,
                caret: start + edit.text.length,
            }

        case 'function': {
            const opening = `${edit.name}(`
            const call = `${opening}${selection})`

            return {
                value: before + call + after,
                caret: start + (selection ? call.length : opening.length),
            }
        }

        case 'backspace': {
            const prefix = start === end ? before.replace(/[\s\S]$/u, '') : before

            return {
                value: prefix + after,
                caret: prefix.length,
            }
        }
    }
}