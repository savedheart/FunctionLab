import { useState } from 'react';
import style from './HeroAnimation.module.css'

interface   GraphState  {
    path: string;
    color: string;
}

/*
function getRandomColor(): string{
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
*/

function generateSmoothWave(): string {
    const wavesCount = Math.floor(Math.random() * 10) + 1; 
    const stepX = 600 / wavesCount;
    let path = "M 0 75";

    for (let i = 0; i < wavesCount; i++) {
        const endX = (i + 1) * stepX;
        const midX = endX - stepX / 2;
        const peakY = i % 2 === 0 
            ? Math.floor(Math.random() * 70) + 5 
            : Math.floor(Math.random() * 70) + 75;

        path += ` Q ${midX} ${peakY}, ${endX} 75`;
  }
  return path;
}

function generateSharpWave(): string {
    const peaks = Math.floor(Math.random() * 10) + 2;
    const stepX = 600 / peaks;
    let path = "M 0 75";

  for (let i = 1; i <= peaks; i++) {
    const currentX = i * stepX;
    const currentY = i % 2 === 0 
        ? Math.floor(Math.random() * 70) + 5 
        : Math.floor(Math.random() * 70) + 75;
    path += ` L ${currentX} ${currentY}`;
  }
  return path;
}

function generateMonotonic(): string {
    const isRising = Math.random() > 0.5;
    const startY = isRising 
        ? Math.floor(Math.random() * 30) + 110 
        : Math.floor(Math.random() * 30) + 10;
    const endY = isRising 
        ? Math.floor(Math.random() * 30) + 10 
        : Math.floor(Math.random() * 30) + 110;
    const controlX = Math.floor(Math.random() * 500) + 50;
    const controlY = startY; 
    return `M 0 ${startY} Q ${controlX} ${controlY}, 600 ${endY}`;
}

function getPathData(): string {
  const type = Math.floor(Math.random() * 3); // 0, 1 або 2

    switch (type) {
        case 0:
        return generateSmoothWave();
        case 1:
        return generateSharpWave();
        case 2:
        return generateMonotonic();
        default:
        return generateSmoothWave();
    }
}

export default function HeroAnimation(){
    const [graph, setGraph] = useState<GraphState >(() => ({
        path: getPathData(),
        color: '#B6FF2E',
    }));

    const handleIteration = () => {
        setGraph({
            path: getPathData(),
            color: '#B6FF2E',
        });
    };

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
    );
}




