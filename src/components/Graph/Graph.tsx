import { useFunctionPlots } from "../../hooks/useFunctionPlots"
import { useEffect, useRef, useState } from 'react'

import plus from '../../assets/plus.svg'
import minus from '../../assets/minus.svg'
import fullscreen from '../../assets/expand-arrows.svg'
import style from './Graph.module.css'

import type { PlotFunction } from "../../types/PlotFunction"

import JXG from 'jsxgraph'

const DEFAULT_BOUNDING_BOX: [number, number, number, number] = [-10, 10, 10, -10]

type GraphProps = {
    plots: readonly PlotFunction[]
    showGrid: boolean
    resetSignal: number
}

function getGridTickAttributes(showGrid: boolean): Pick<JXG.TicksOptions, 'majorHeight' | 'minorHeight'> {
    // Negative height stretches ticks across the whole board as grid lines; positive keeps short axis ticks only.
    return showGrid
        ? { majorHeight: -1, minorHeight: -1 }
        : { majorHeight: 8, minorHeight: 0 }
}

function getNiceStep(pixelsPerUnit: number, targetPixels = 90): number {
    const rawStep = targetPixels / pixelsPerUnit
    const power = 10 ** Math.floor(Math.log10(rawStep))
    const normalized = rawStep / power
    if (normalized <= 1) return power
    if (normalized <= 2) return 2 * power
    if (normalized <= 5) return 5 * power
    return 10 * power
}

function createAxisConfig(
    labelOffset: [number, number],
    drawZero: boolean,
    showGrid: boolean
): JXG.AxisAttributes {
    return {
        name: '', // можна написати 'x' / 'y', щоб показувалося на краю осі
        withLabel: true,
        lastArrow: false,
        layer: 2,
        strokeColor: '#76787B',
        strokeWidth: 1.5,
        highlight: false, // щоб вісь не підсвічувалась при наведенні
        label: {
            position: 'rt',
            offset: labelOffset,
            color: '#F1F4EE',
            fontSize: 14,
            highlight: false,
        },
        ticks: {
            layer: 1, // сітка завжди під осями (axis: layer 2)
            insertTicks: false,
            ticksDistance: 2,     // автопідбір кроку чисел
            minorTicks: 3,         // 4 дрібні підсітки між числами
            ...getGridTickAttributes(showGrid),
            strokeColor: '#353A45',
            strokeOpacity: 0.65,
            drawLabels: true,
            drawZero,
            label: {
                color: '#F1F4EE',
                fontSize: 12,
                highlight: false,
            },
        },
        
    }
}

export default function Graph({ plots, showGrid, resetSignal }: GraphProps) {
    const boardRef = useRef<JXG.Board | null>(null)
    const axesRef = useRef<{ x: JXG.Axis; y: JXG.Axis } | null>(null)
    const initialShowGridRef = useRef(showGrid)
    const boardId = 'functionlab-graph-board'

    useEffect(() => {
        const board = JXG.JSXGraph.initBoard(boardId, {
            boundingbox: DEFAULT_BOUNDING_BOX, // [left, top, right, bottom]
            axis: false,
            showCopyright: false,
            showNavigation: false,
            keepAspectRatio: true,
            pan: { enabled: true, needShift: false, needTwoFingers: false },
            zoom: { wheel: true, needShift: false, factorX: 1.15, factorY: 1.15 },
            resize: { enabled: false, throttle: 10 },
            maxFrameRate: 240,
        })

        boardRef.current = board

        const xAxis = board.create('axis', [[0, 0], [1, 0]], createAxisConfig([-14, 14], true, initialShowGridRef.current))
        const yAxis = board.create('axis', [[0, 0], [0, 1]], createAxisConfig([12, -14], false, initialShowGridRef.current))
        axesRef.current = { x: xAxis, y: yAxis }

        let currentStepX = 0
        let currentStepY = 0

        const syncGridStep = () => {
            if (board.unitX <= 0 || board.unitY <= 0) return

            const nextStepX = getNiceStep(board.unitX)
            const nextStepY = board.keepaspectratio ? nextStepX : getNiceStep(board.unitY)

            if (nextStepX === currentStepX && nextStepY === currentStepY) return

            currentStepX = nextStepX
            currentStepY = nextStepY
            xAxis.defaultTicks.setAttribute({ ticksDistance: nextStepX })
            yAxis.defaultTicks.setAttribute({ ticksDistance: nextStepY })

            // Defer fullUpdate past JSXGraph's inUpdate guard so ticks redraw immediately on Reset and range/zoom steps.
            queueMicrotask(() => {
                if (boardRef.current === board) {
                    board.fullUpdate()
                }
            })
        }

        syncGridStep()
        board.on('update', syncGridStep)

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect
            if (width > 0 && height > 0) {
                board.resizeContainer(width, height, true, true)
                board.update()
            }
        })
        observer.observe(board.containerObj)

        return () => {
            observer.disconnect()
            JXG.JSXGraph.freeBoard(board)
            boardRef.current = null
            axesRef.current = null
        }
    }, [])

    useEffect(() => {
        const board = boardRef.current
        const axes = axesRef.current
        if (!board || !axes) return

        const gridAttributes = getGridTickAttributes(showGrid)
        axes.x.defaultTicks.setAttribute(gridAttributes)
        axes.y.defaultTicks.setAttribute(gridAttributes)
        board.update()
    }, [showGrid])

    useEffect(() => {
        if (resetSignal === 0) return
        const board = boardRef.current
        if (!board) return

        board.setBoundingBox(DEFAULT_BOUNDING_BOX, true, 'reset')
        board.fullUpdate()
    }, [resetSignal])

    useFunctionPlots(boardRef, plots)

    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        if (!isFullscreen) return

        document.body.style.overflow = 'hidden'
        const mediaQuery = window.matchMedia('(max-width: 1024px)')

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsFullscreen(false)
        }

        // Automatically exit mobile fullscreen if viewport expands to desktop width.
        const handleMediaChange = (event: MediaQueryListEvent) => {
            if (!event.matches) setIsFullscreen(false)
        }

        window.addEventListener('keydown', handleKeyDown)
        mediaQuery.addEventListener('change', handleMediaChange)

        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
            mediaQuery.removeEventListener('change', handleMediaChange)
        }
    }, [isFullscreen])

    function handleZoomIn() {
        boardRef.current?.zoomIn() // for mobile buttons
    }

    function handleZoomOut() {
        boardRef.current?.zoomOut() // for mobile buttons
    }

    function handleToggleFullscreen() {
        setIsFullscreen((prev) => !prev)
    }

    return (
        <section
            className={`${style.graph} ${isFullscreen ? style['graph--fullscreen'] : ''}`}
            aria-label="Function graph"
        >
            <div className={style.graph__header}>
                <h2 className={style.graph__title}>Graph</h2>

                <div className={style.graph__toolbar} aria-label="Graph controls">
                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label="Zoom in"
                        onClick={handleZoomIn}
                    >
                        <img src={plus} alt="" />
                    </button>

                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label="Zoom out"
                        onClick={handleZoomOut}
                    >
                        <img src={minus} alt="" />
                    </button>

                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        aria-pressed={isFullscreen}
                        onClick={handleToggleFullscreen}
                    >
                        <img src={fullscreen} alt="" />
                    </button>
                </div>
            </div>

            <div className={style.graph__viewport}>
                {/* Inline position prevents JSXGraph's svg.js from forcing position: relative and collapsing height */}
                <div className={style.graph__board} id={boardId} style={{ position: 'absolute' }} />
            </div>
        </section>
    );
}