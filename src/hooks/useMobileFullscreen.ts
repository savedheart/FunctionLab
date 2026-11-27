import { useEffect, useState } from 'react'

export function useMobileFullscreen() {
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

    function toggleFullscreen() {
        setIsFullscreen((prev) => !prev)
    }

    return {
        isFullscreen,
        toggleFullscreen,
    }
}
