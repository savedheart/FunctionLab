//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './styles/global.css'
import Homepage from './pages/homepage'
import CalculatorPage from './pages/calculatorPage.tsx'
import Page404 from './pages/Page404'

const router = createBrowserRouter([
    {
        path: '/Homepage',
        element: <Homepage />,
    },
    {
        path: '/calculator',
        element: <CalculatorPage />
    },
    {
        path: '*',
        element: <Page404 />
    }
]);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router = {router} />
);