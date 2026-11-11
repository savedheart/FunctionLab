import { useState } from 'react'
import type { MathFunction } from "../types/MathFunction"

const functionColors: MathFunction['color'][] = [
    'green',
    'cyan',
    'purple',
    'red'
]

export function useFunctions() {
    const [functions, setFunctions] = useState<MathFunction[]>([
        { id: 1, expression: '', color: 'green', visible: true },
        { id: 2, expression: '', color: 'cyan', visible: true },
        { id: 3, expression: '', color: 'purple', visible: true },
        { id: 4, expression: '', color: 'red', visible: true }
    ])

    const [nextId, setNextId] = useState(5)

    function addFunction(expression: string) {
        if (!expression.trim()) return

        const newFunction: MathFunction = {
            id: nextId,
            expression: expression.trim(),
            color: functionColors[(nextId - 1) % functionColors.length],
            visible: true
        }

        setFunctions(prev => [...prev, newFunction])
        setNextId(prev => prev + 1)
    }

    function toggleVisibility(id: number, visible: boolean) {
        setFunctions(prev =>
            prev.map(func =>
                func.id === id ? { ...func, visible} : func
            )
        )
    }

    return {
        functions,
        addFunction,
        toggleVisibility
    }
}