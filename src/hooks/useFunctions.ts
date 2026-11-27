import { useState } from 'react'
import { functionColorNames } from '../constants/functionColors'
import type { FunctionColor, MathFunction } from '../types/MathFunction'
import type { Expression } from '../types/Expression'

// Step 3 (skipping 2 adjacent colors) is coprime with 10, so every color is used once with high contrast.
const COLOR_STEP = 3

export function useFunctions() {
    const [functions, setFunctions] = useState<MathFunction[]>([])
    const [nextId, setNextId] = useState(1)

    function addFunction(expression: string, parsedExpression: Expression) {
        const colorIndex = ((nextId - 1) * COLOR_STEP) % functionColorNames.length
        const newFunction: MathFunction = {
            id: nextId,
            expression,
            parsedExpression,
            color: functionColorNames[colorIndex],
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