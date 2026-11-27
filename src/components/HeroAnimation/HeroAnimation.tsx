import { useState } from 'react'
import { getHeroPathData } from '../../utils/heroWavePaths'
import style from './HeroAnimation.module.css'

const HERO_WAVE_COLOR = '#B6FF2E'

type GraphState = {
    path: string
    color: string
}

export default function HeroAnimation() {
    const [graph, setGraph] = useState<GraphState>(() => ({
        path: getHeroPathData(),
        color: HERO_WAVE_COLOR,
    }))

    function handleIteration() {
        setGraph({
            path: getHeroPathData(),
            color: HERO_WAVE_COLOR,
        })
    }

    return (
        <aside className={style.asideAnimation}>
            <svg
                className={style.graphLine}
                viewBox="0 0 600 150"
                preserveAspectRatio="none"
                style={{ color: graph.color }}
                onAnimationIteration={handleIteration}
            >
                <path d={graph.path} />
            </svg>
        </aside>
    )
}
