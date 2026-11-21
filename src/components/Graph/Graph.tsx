import plus from '../../assets/plus.svg'
import minus from '../../assets/minus.svg'
import fullscreen from '../../assets/expand-arrows.svg'
import reset from '../../assets/reset.svg'
import style from './Graph.module.css'

import { useEffect, useRef, useState } from 'react'
import JXG from 'jsxgraph'

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
    drawZero: boolean
): JXG.AxisAttributes {
    return {
        name: '', // можна написати 'x' / 'y', щоб показувалося на краю осі
        withLabel: true,
        lastArrow: false,
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
            insertTicks: false,
            ticksDistance: 2,     // автопідбір кроку чисел
            minorTicks: 3,         // 4 дрібні підсітки між числами
            majorHeight: -1,       // головні лінії сітки на весь екран
            minorHeight: -1,       // дрібні лінії сітки (або 0, якщо не потрібні)
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

export default function Graph() {
    const boardRef = useRef<JXG.Board | null>(null)
    const boardId = 'functionlab-graph-board'

    useEffect(() => {
        const board = JXG.JSXGraph.initBoard(boardId, {
            boundingbox: [-10, 10, 10, -10], // [left, top, right, bottom]
            axis: false,
            showCopyright: false,
            showNavigation: false,
            keepAspectRatio: true,
            resize: { enabled: false, throttle: 10 },
            maxFrameRate: 240,
        })

        boardRef.current = board

        const xAxis = board.create('axis', [[0, 0], [1, 0]], createAxisConfig([-14, 14], true))
        const yAxis = board.create('axis', [[0, 0], [0, 1]], createAxisConfig([12, -14], false))

        let currentStep = 0

        const syncGridStep = () => {
            if (board.unitX <= 0) return

            const nextStep = getNiceStep(board.unitX)
            if (nextStep === currentStep) return // оновлюємо лише коли крок реально змінився

            currentStep = nextStep
            xAxis.defaultTicks.setAttribute({ ticksDistance: nextStep })
            yAxis.defaultTicks.setAttribute({ ticksDistance: nextStep })
            board.update()
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
        }
    }, [])

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

                    <button type="button" className={style.graph__button} aria-label="Reset view">
                        <img src={reset} alt="" />
                    </button>
                </div>
            </div>

            <div className={style.graph__viewport} id={boardId}>
                
            </div>
        </section>
    );
}