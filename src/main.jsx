import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    Element:<App/>,
    path:"/",
    children:[{
      Element:<Home/>,
      path:"/"
    },
     {
    Element:<About/>,
    Path:"/about"
    }
]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>

  </StrictMode>,
)
