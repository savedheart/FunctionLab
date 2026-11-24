import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Homepage from './pages/homepage'
import Workpage from './pages/workpage.tsx'
import Page404 from './pages/Page404'

import './styles/global.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to='/homepage' replace />,
    },
    {
        path: '/homepage',
        element: <Homepage />,
    },
    {
        path: '/workpage',
        element: <Workpage />
    },
    {
        path: '*',
        element: <Page404 />
    }
]);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router = {router} />
);