import plus from '../../assets/plus.svg'
import minus from '../../assets/minus.svg'
import fullscreen from '../../assets/expand-arrows.svg'
import reset from '../../assets/reset.svg'
import style from './Graph.module.css'

import { useEffect, useRef } from 'react'
import JXG from 'jsxgraph'

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
            insertTicks: true,     // автопідбір кроку чисел
            minTicksDistance: 25,  // мінімум пікселів між підписами
            minorTicks: 4,         // 4 дрібні підсітки між числами
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
            axis: true,
            showCopyright: false,
            showNavigation: false,
            keepAspectRatio: true,
            defaultAxes: {
                x: createAxisConfig([-14, 14], true),
                y: createAxisConfig([12, -14], false),
            },
        })

        boardRef.current = board

        return () => {
            JXG.JSXGraph.freeBoard(board)
            boardRef.current = null
        }
    }, [])

    return (
        <section className={style.graph} aria-label="Function graph">
            <div className={style.graph__header}>
                <h2 className={style.graph__title}>Graph</h2>

                <div className={style.graph__toolbar} aria-label="Graph controls">
                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label="Zoom in"
                    >
                        <img src={plus} alt="" />
                    </button>

                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label="Zoom out"
                    >
                        <img src={minus} alt="" />
                    </button>

                    <button
                        type="button"
                        className={`${style.graph__button} ${style['graph__button--mobile-only']}`}
                        aria-label="Enter fullscreen"
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