//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import Homepage from './pages/homepage.tsx'
import Page404 from './pages/Page404.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage/>,
        errorElement: <Page404/>,
    }, 
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router = {router} />);

