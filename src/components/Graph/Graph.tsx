import plus from '../../assets/plus.svg'
import minus from '../../assets/minus.svg'
import fullscreen from '../../assets/expand-arrows.svg'

import { useFunctionPlots } from '../../hooks/useFunctionPlots'
import { useGraphBoard } from '../../hooks/useGraphBoard'
import { useMobileFullscreen } from '../../hooks/useMobileFullscreen'
import type { PlotFunction } from '../../types/PlotFunction'

import style from './Graph.module.css'

const BOARD_ID = 'functionlab-graph-board'

type GraphProps = {
    plots: readonly PlotFunction[]
    showGrid: boolean
    resetSignal: number
}

export default function Graph({ plots, showGrid, resetSignal }: GraphProps) {
    const { boardRef, zoomIn, zoomOut } = useGraphBoard({
        boardId: BOARD_ID,
        showGrid,
        resetSignal,
    })

    useFunctionPlots(boardRef, plots)

    const { isFullscreen, toggleFullscreen } = useMobileFullscreen()

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
                        onClick={zoomIn}
                    >
                        <img src={plus} alt="" />
                    </button>

                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label="Zoom out"
                        onClick={zoomOut}
                    >
                        <img src={minus} alt="" />
                    </button>

                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        aria-pressed={isFullscreen}
                        onClick={toggleFullscreen}
                    >
                        <img src={fullscreen} alt="" />
                    </button>
                </div>
            </div>

            <div className={style.graph__viewport}>
                {/* Inline position prevents JSXGraph's svg.js from forcing position: relative and collapsing height */}
                <div className={style.graph__board} id={BOARD_ID} style={{ position: 'absolute' }} />
            </div>
        </section>
    )
}
