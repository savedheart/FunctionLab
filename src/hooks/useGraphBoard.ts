import { useEffect, useRef } from 'react'
import JXG from 'jsxgraph'
import {
    createAxisConfig,
    DEFAULT_BOUNDING_BOX,
    getGridTickAttributes,
    getNiceStep,
} from '../utils/graphBoard'

type UseGraphBoardOptions = {
    boardId: string
    showGrid: boolean
    resetSignal: number
}

export function useGraphBoard({ boardId, showGrid, resetSignal }: UseGraphBoardOptions) {
    const boardRef = useRef<JXG.Board | null>(null)
    const axesRef = useRef<{ x: JXG.Axis; y: JXG.Axis } | null>(null)
    const initialShowGridRef = useRef(showGrid)

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
    }, [boardId])

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

    function zoomIn() {
        boardRef.current?.zoomIn()
    }

    function zoomOut() {
        boardRef.current?.zoomOut()
    }

    return {
        boardRef,
        zoomIn,
        zoomOut,
    }
}
