import { useState } from 'react'
import { functionColorNames } from '../constants/functionColors'
import type { FunctionColor, MathFunction } from '../types/MathFunction'

export function useFunctions() {
    const [functions, setFunctions] = useState<MathFunction[]>([])
    const [nextId, setNextId] = useState(1)

    function addFunction(expression: string) {
        const trimmed = expression.trim()
        if (!trimmed) return

        const newFunction: MathFunction = {
            id: nextId,
            expression: trimmed,
            color: functionColorNames[(nextId - 1) % functionColorNames.length],
            visible: true,
        }

        setFunctions(prev => [...prev, newFunction])
        setNextId(prev => prev + 1)
    }

    function toggleVisibility(id: number, visible: boolean) {
        setFunctions(prev =>
            prev.map(func => func.id === id ? { ...func, visible } : func)
        )
    }

    function changeFunctionColor(id: number, color: FunctionColor) {
        setFunctions(prev =>
            prev.map(func => func.id === id ? { ...func, color } : func)
        )
    }

    function removeFunction(id: number) {
        setFunctions(prev => prev.filter(func => func.id !== id))
    }

    return {
        functions,
        addFunction,
        toggleVisibility,
        changeFunctionColor,
        removeFunction,
    }
}