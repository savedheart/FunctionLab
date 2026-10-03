// src/main.tsx — тонкий технічний місток між HTML та React

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Homepage from './pages/homepage.tsx'
import Graphspage from './pages/graphspage.tsx'
import Page404 from './pages/page404.tsx'

import './styles/global.css';

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