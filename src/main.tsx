// src/main.tsx — тонкий технічний місток між HTML та React

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Homepage from './homepage.tsx'
import Graphspage from './graphspage.tsx'
import Page404 from './page404.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage/>,
        errorElement: <Page404/>,
    },
    {
        path: '/graphs',
        element: <Graphspage />,
    },
]);




createRoot(document.getElementById('root')!).render(<RouterProvider router = {router} />)