import { useState } from 'react'

export function useKeypad() {
    const [keypadVisible, setKeypadVisible] = useState<boolean>(false)

    function toggleKeypad() {
        setKeypadVisible(prev => !prev)
    }

    return { keypadVisible, toggleKeypad }
}