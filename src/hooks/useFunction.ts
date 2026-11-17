import { useState } from 'react'
import type { MathFunction } from "../types/MathFunction"

const functionColors: MathFunction['color'][] = ['green', 'cyan', 'purple', 'red', 'orange', 'pink', 'blue', 'yellow', 'teal', 'magenta', 'lime', 'coral', 'indigo', 'gold', 'violet']

export function useFunctions() {
    const [functions, setFunctions] = useState<MathFunction[]>([])

    const [nextId, setNextId] = useState(1)

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