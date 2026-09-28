// src/main.tsx — тонкий технічний місток між HTML та React

import { createRoot } from 'react-dom/client'
import Homepage from './homepage.tsx'

createRoot(document.getElementById('root')!).render(<Homepage />)