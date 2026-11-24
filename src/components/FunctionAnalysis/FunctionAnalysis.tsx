import infinity from '../../assets/infinity.svg'
import range from '../../assets/expand.svg'
import intercepts from '../../assets/aim.svg'
import extrema from '../../assets/arrows-verticle.svg'
import periodicity from '../../assets/graph.svg'
import calculator from '../../assets/calculator_1.svg'
import hideToRight from '../../assets/hide-sidebar-toRight.svg'

import { useMemo, useState } from 'react'
import type { MathFunction } from '../../types/MathFunction'
import { analyzeFunction } from '../../utils/analyzeFunction'

import style from './FunctionAnalysis.module.css'

type FunctionAnalysisProps = {
    functions: MathFunction[]
    selectedId: number | null
    onSelectId: (id: number) => void
    onCollapse?: () => void
}

const DEFAULT_ANALYSIS_WINDOW = { minX: -10, maxX: 10 }
const DOMAIN_PROBE_OFFSETS = [25, 50, 100]
const RANGE_FAR_PROBES = [25, 50, 100, 1e4, 1e8, 1e12]
const SYMMETRY_SAMPLE_XS = [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6.5, 8, 9.5]

type DomainInterval = {
    min: number
    max: number
    openMin: boolean
    openMax: boolean
}

function formatNumber(value: number): string {
    if (value === Infinity) return '+∞'
    if (value === -Infinity) return '−∞'

    const normalized = Math.abs(value) < 1e-9 ? 0 : value
    return Number(normalized.toFixed(3)).toString()
}

function formatInterval(min: number, max: number, openMin = false, openMax = false): string {
    const leftBracket = openMin || min === -Infinity ? '(' : '['
    const rightBracket = openMax || max === Infinity ? ')' : ']'
    return `${leftBracket}${formatNumber(min)}, ${formatNumber(max)}${rightBracket}`
}

function resolveExtendedDomain(
    sampledDomain: Array<{ min: number; max: number }>,
    valueAt: (x: number) => number | null
): DomainInterval[] {
    if (sampledDomain.length === 0) return []

    const { minX, maxX } = DEFAULT_ANALYSIS_WINDOW
    const step = (maxX - minX) / 1000

    return sampledDomain.map((interval, index) => {
        let min = interval.min
        let max = interval.max
        let openMin = false
        let openMax = false

        // Extend leftmost interval to -∞ if it reaches the window edge and stays defined farther left.
        if (index === 0 && min <= minX + step) {
            const definedFarLeft = DOMAIN_PROBE_OFFSETS.some((d) => valueAt(-d) !== null)
                && valueAt(minX - 15) !== null
            if (definedFarLeft) {
                min = -Infinity
                openMin = true
            }
        } else if (Math.abs(min) <= step * 2 && valueAt(0) === null && valueAt(1e-6) !== null) {
            min = 0
            openMin = true
        } else if (valueAt(min) === null) {
            openMin = true
        }

        // Extend rightmost interval to +∞ if it reaches the window edge and stays defined farther right.
        if (index === sampledDomain.length - 1 && max >= maxX - step) {
            const definedFarRight = DOMAIN_PROBE_OFFSETS.some((d) => valueAt(d) !== null)
                && valueAt(maxX + 15) !== null
            if (definedFarRight) {
                max = Infinity
                openMax = true
            }
        } else if (Math.abs(max) <= step * 2 && valueAt(0) === null && valueAt(-1e-6) !== null) {
            max = 0
            openMax = true
        } else if (valueAt(max) === null) {
            openMax = true
        }

        return { min, max, openMin, openMax }
    })
}

function isUnboundedDirection(values: number[], direction: 'up' | 'down', windowBound: number): boolean {
    if (values.length === 0) return false

    const extreme = direction === 'up' ? Math.max(...values) : Math.min(...values)

    // Clear blow-up (polynomials, exponentials, vertical asymptotes)
    if (direction === 'up' && (extreme > 1e5 || extreme > Math.max(windowBound * 1.5, windowBound + 50))) {
        return true
    }
    if (direction === 'down' && (extreme < -1e5 || extreme < Math.min(windowBound * 1.5, windowBound - 50))) {
        return true
    }

    // Slow unbounded growth (e.g., ln(x), log(x), sqrt(x)) across orders of magnitude
    if (values.length >= 3) {
        const tail = values.slice(-3)
        if (direction === 'up' && tail[2] > tail[1] + 0.5 && tail[1] > tail[0] + 0.5) {
            return true
        }
        if (direction === 'down' && tail[2] < tail[1] - 0.5 && tail[1] < tail[0] - 0.5) {
            return true
        }
    }

    return false
}

function resolveExtendedRange(
    sampledRange: { min: number; max: number } | null,
    domain: DomainInterval[],
    valueAt: (x: number) => number | null
): string {
    if (!sampledRange) return 'Undefined'

    const rightValues: number[] = []
    const leftValues: number[] = []
    const gapValues: number[] = []

    const hasNegInf = domain.some((d) => d.min === -Infinity)
    const hasPosInf = domain.some((d) => d.max === Infinity)

    if (hasPosInf) {
        for (const x of RANGE_FAR_PROBES) {
            const y = valueAt(x)
            if (y !== null) rightValues.push(y)
        }
    }

    if (hasNegInf) {
        for (const x of RANGE_FAR_PROBES) {
            const y = valueAt(-x)
            if (y !== null) leftValues.push(y)
        }
    }

    // Probe near open domain boundaries (e.g., x -> 0+ for ln(x) or 1/x)
    const nearEps = [1e-3, 1e-6, 1e-10]
    for (const interval of domain) {
        if (interval.openMin && Number.isFinite(interval.min)) {
            for (const eps of nearEps) {
                const y = valueAt(interval.min + eps)
                if (y !== null) gapValues.push(y)
            }
        }
        if (interval.openMax && Number.isFinite(interval.max)) {
            for (const eps of nearEps) {
                const y = valueAt(interval.max - eps)
                if (y !== null) gapValues.push(y)
            }
        }
    }

    const unboundedUp =
        isUnboundedDirection(rightValues, 'up', sampledRange.max) ||
        isUnboundedDirection(leftValues, 'up', sampledRange.max) ||
        isUnboundedDirection(gapValues, 'up', sampledRange.max)

    const unboundedDown =
        isUnboundedDirection(rightValues, 'down', sampledRange.min) ||
        isUnboundedDirection(leftValues, 'down', sampledRange.min) ||
        isUnboundedDirection(gapValues, 'down', sampledRange.min)

    const allExtra = [...rightValues, ...leftValues, ...gapValues]
    const min = unboundedDown
        ? -Infinity
        : Math.min(sampledRange.min, ...(allExtra.length > 0 ? allExtra : [sampledRange.min]))
    const max = unboundedUp
        ? Infinity
        : Math.max(sampledRange.max, ...(allExtra.length > 0 ? allExtra : [sampledRange.max]))

    if (Number.isFinite(min) && Number.isFinite(max) && Math.abs(max - min) < 1e-9) {
        return `{${formatNumber(min)}}`
    }

    return formatInterval(min, max, min === -Infinity, max === Infinity)
}

function formatPoint(point: { x: number; y: number }): string {
    return `(${formatNumber(point.x)}, ${formatNumber(point.y)})`
}

function formatPointList(points: Array<{ x: number; y: number }>, limit = 4): string {
    if (points.length === 0) return 'None'

    const visible = points.slice(0, limit).map(formatPoint).join(', ')
    return points.length > limit ? `${visible}, …` : visible
}

function detectSymmetry(valueAt: (x: number) => number | null): string {
    let isEven = true
    let isOdd = true
    let definedPairs = 0

    for (const x of SYMMETRY_SAMPLE_XS) {
        const yPos = valueAt(x)
        const yNeg = valueAt(-x)

        if (yPos === null && yNeg === null) continue
        if (yPos === null || yNeg === null) return 'Neither'

        definedPairs++
        const tolerance = 1e-6 * Math.max(1, Math.abs(yPos), Math.abs(yNeg))
        if (Math.abs(yPos - yNeg) > tolerance) isEven = false
        if (Math.abs(yPos + yNeg) > tolerance) isOdd = false
    }

    if (definedPairs === 0) return '—'
    if (isEven && isOdd) return 'Even & Odd'
    if (isEven) return 'Even'
    if (isOdd) return 'Odd'
    return 'Neither'
}

export default function FunctionAnalysis({
    functions,
    selectedId,
    onSelectId,
    onCollapse,
}: FunctionAnalysisProps) {
    const [xInput, setXInput] = useState('')

    const selectedFunction = functions.find(func => func.id === selectedId) ?? functions.at(-1) ?? null
    const activeExpression = selectedFunction?.expression ?? ''
    const selectValue = selectedFunction?.id ?? ''

    const analysis = useMemo(() => {
        if (!activeExpression) return null

        const result = analyzeFunction(activeExpression, DEFAULT_ANALYSIS_WINDOW)
        return result.valid ? result : null
    }, [activeExpression])

    const extendedDomain = useMemo(() => {
        if (!analysis) return []
        return resolveExtendedDomain(analysis.sampledDomain, analysis.valueAt)
    }, [analysis])

    const domainText = useMemo(() => {
        if (!analysis) return '—'
        if (extendedDomain.length === 0) {
            return `Undefined on ${formatInterval(DEFAULT_ANALYSIS_WINDOW.minX, DEFAULT_ANALYSIS_WINDOW.maxX)}`
        }
        return extendedDomain
            .map((interval) => formatInterval(interval.min, interval.max, interval.openMin, interval.openMax))
            .join(' ∪ ')
    }, [analysis, extendedDomain])

    const rangeText = useMemo(() => {
        if (!analysis) return '—'
        return resolveExtendedRange(analysis.sampledRange, extendedDomain, analysis.valueAt)
    }, [analysis, extendedDomain])

    const xInterceptsText = useMemo(() => {
        if (!analysis) return '—'
        if (analysis.allFiniteSamplesZero) return 'All x in domain'
        if (analysis.xIntercepts.length === 0) return 'None'

        const visible = analysis.xIntercepts.slice(0, 6).map(formatNumber).join(', ')
        return analysis.xIntercepts.length > 6 ? `${visible}, …` : visible
    }, [analysis])

    const yInterceptText = analysis
        ? (analysis.yIntercept ? formatPoint(analysis.yIntercept) : 'None')
        : '—'

    const minimaText = analysis ? formatPointList(analysis.localMinima) : '—'
    const maximaText = analysis ? formatPointList(analysis.localMaxima) : '—'
    const symmetryText = useMemo(
        () => (analysis ? detectSymmetry(analysis.valueAt) : '—'),
        [analysis]
    )

    let valueAtXText = '—'
    if (analysis && xInput.trim()) {
        const parsedX = Number(xInput)
        if (!Number.isFinite(parsedX)) {
            valueAtXText = 'Invalid x'
        } else {
            const evaluated = analysis.valueAt(parsedX)
            valueAtXText = evaluated === null ? 'Undefined' : formatNumber(evaluated)
        }
    }

    return (
        <section className={style['function-analysis']}>
            <div className={style['function-analysis__header']}>
                <h2 className={style['function-analysis__title']}>
                    Function Analysis
                </h2>

                {onCollapse && (
                    <button
                        type="button"
                        className={style['function-analysis__collapse']}
                        onClick={onCollapse}
                        aria-label="Hide analysis panel"
                    >
                        <img src={hideToRight} alt="" />
                    </button>
                )}
            </div>

            <select
                className={style['function-analysis__select']}
                aria-label="Select function to analyze"
                value={selectValue}
                onChange={(event) => onSelectId(Number(event.target.value))}
            >
                {functions.every(func => !func.expression.trim()) && (
                    <option value="" disabled>
                        Select function
                    </option>
                )}

                {functions.filter(func => func.expression.trim()).map(func => (
                    <option key={func.id} value={func.id}>
                        {func.expression}
                    </option>
                ))}
            </select>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={infinity} alt="" className={style['function-analysis__icon']} />
                    <span>Domain</span>
                </div>
                <p className={style['function-analysis__value']}>{domainText}</p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={range} alt="" className={style['function-analysis__icon']} />
                    <span>Range</span>
                </div>
                <p className={style['function-analysis__value']}>{rangeText}</p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={intercepts} alt="" className={style['function-analysis__icon']} />
                    <span>Intercepts</span>
                </div>

                <p>
                    x-intercepts: <span className={style['function-analysis__value']}>{xInterceptsText}</span>
                </p>
                <p>
                    y-intercepts: <span className={style['function-analysis__value']}>{yInterceptText}</span>
                </p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={extrema} alt="" className={style['function-analysis__icon']} />
                    <span>Extrema</span>
                </div>

                <p>
                    Minimum: <span className={style['function-analysis__value']}>{minimaText}</span>
                </p>
                <p>
                    Maximum: <span className={style['function-analysis__value']}>{maximaText}</span>
                </p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={periodicity} alt="" className={style['function-analysis__icon']} />
                    <span>Periodicity / Symmetry</span>
                </div>

                <p>
                    Symmetry: <span className={style['function-analysis__value']}>{symmetryText}</span>
                </p>
                <p>
                    Period: <span className={style['function-analysis__value']}>{analysis ? 'Not determined' : '—'}</span>
                </p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={calculator} alt="" className={style['function-analysis__icon']} />
                    <span>Value at x</span>
                </div>

                <div className={style['function-analysis__calculator']}>
                    <label htmlFor="analysis-x">x =</label>
                    <input
                        id="analysis-x"
                        type="text"
                        inputMode="decimal"
                        className={style['function-analysis__input']}
                        value={xInput}
                        onChange={(event) => setXInput(event.target.value)}
                    />
                    <span>
                        f(x) = <strong className={style['function-analysis__value']}>{valueAtXText}</strong>
                    </span>
                </div>
            </div>
        </section>
    )
}