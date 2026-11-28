import { useMemo, useState } from 'react'

import type { MathFunction } from '../types/MathFunction'
import { analyzeFunction } from '../utils/analyzeFunction'
import { DEFAULT_ANALYSIS_WINDOW, detectSymmetry, resolveExtendedDomain, resolveExtendedRange } from '../utils/extendedAnalysis'
import { formatInterval, formatNumber, formatPoint, formatPointList } from '../utils/formatAnalysis'
import { formatValueAtX } from '../utils/formatValueAtX'
import { resolveKnownRange } from "../utils/resolveKnownRange"

const MAX_DISPLAYED_DOMAIN_INTERVALS = 4

function resolveExpressionSignature(expression: string): { paramName: string; outputLabel: string } {
    const fnMatch = /^\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*\(\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*\)\s*=/.exec(expression)
    if (fnMatch) {
        return {
            paramName: fnMatch[2],
            outputLabel: `${fnMatch[1]}(${fnMatch[2]})`,
        }
    }

    if (/^\s*y\s*=/.test(expression)) {
        return { paramName: 'x', outputLabel: 'y' }
    }

    return { paramName: 'x', outputLabel: 'f(x)' }
}

export function useFunctionAnalysis(
    functions: readonly MathFunction[],
    selectedId: number | null
) {
    const [xInput, setXInput] = useState('')

    const selectedFunction = functions.find((func) => func.id === selectedId) ?? functions.at(-1) ?? null
    const activeExpression = selectedFunction?.expression ?? ''
    const selectValue = selectedFunction?.id ?? ''

    const { paramName, outputLabel } = useMemo(
        () => resolveExpressionSignature(activeExpression),
        [activeExpression]
    )

    const analysis = useMemo(() => {
        if (!activeExpression) return null

        const result = analyzeFunction(activeExpression, DEFAULT_ANALYSIS_WINDOW)
        return result.valid ? result : null
    }, [activeExpression])

    const extendedDomain = useMemo(() => {
        if (!analysis) return []
        return resolveExtendedDomain(analysis.sampledDomain, analysis.valueAt, analysis.window, analysis.step, analysis.domainBreaks,)
    }, [analysis])

    const domainText = useMemo(() => {
        if (!analysis) return '—'
        if (extendedDomain.length === 0) {
            return `Undefined on ${formatInterval(DEFAULT_ANALYSIS_WINDOW.minX, DEFAULT_ANALYSIS_WINDOW.maxX)}`
        }
        const visible = extendedDomain
            .slice(0, MAX_DISPLAYED_DOMAIN_INTERVALS)
            .map(({ min, max, openMin, openMax }) => (
                min === max ? `{${formatNumber(min)}}` : formatInterval(min, max, openMin, openMax)
            ))
            .join(' ∪ ')

        return extendedDomain.length > MAX_DISPLAYED_DOMAIN_INTERVALS ? `${visible} ∪ …` : visible
    }, [analysis, extendedDomain])

    const rangeText = useMemo(() => {
        if (!analysis) return '—'
        return resolveKnownRange(analysis.expression) ?? resolveExtendedRange(analysis.sampledRange, extendedDomain, analysis.valueAt)
    }, [analysis, extendedDomain])

    const xInterceptsText = useMemo(() => {
        if (!analysis) return '—'
        if (analysis.allFiniteSamplesZero) return `All ${paramName} in domain`
        if (analysis.xIntercepts.length === 0) return 'None'

        const visible = analysis.xIntercepts.slice(0, 6).map(formatNumber).join(', ')
        return analysis.xIntercepts.length > 6 ? `${visible}, …` : visible
    }, [analysis, paramName])

    const yInterceptText = analysis
        ? (analysis.yIntercept ? formatPoint(analysis.yIntercept) : 'None')
        : '—'

    const minimaText = analysis ? formatPointList(analysis.localMinima) : '—'
    const maximaText = analysis ? formatPointList(analysis.localMaxima) : '—'

    const symmetryText = useMemo(
        () => (analysis ? detectSymmetry(analysis.valueAt) : '—'),
        [analysis]
    )

    let periodText = '—'

    if (analysis) {
        const { period } = analysis

        if (period === 'any-positive') {
            periodText = 'Any T > 0'
        } else if (period === 'unknown') {
            periodText = 'Not determined'
        } else {
            periodText = period < 1e-9 ? period.toExponential(3) : formatValueAtX(period)
        }
    }

    let valueAtXText = '—'
    if (analysis && xInput.trim()) {
        const parsedX = Number(xInput)
        if (!Number.isFinite(parsedX)) {
            valueAtXText = `Invalid ${paramName}`
        } else {
            const evaluated = analysis.valueAt(parsedX)
            valueAtXText = evaluated === null ? 'Undefined' : formatValueAtX(evaluated)
        }
    }

    return {
        selectValue,
        paramName,
        outputLabel,
        xInput,
        setXInput,
        domainText,
        rangeText,
        xInterceptsText,
        yInterceptText,
        minimaText,
        maximaText,
        symmetryText,
        periodText,
        valueAtXText,
    }
}
