import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route,} from "react-router-dom";
import './index.css';
import Root from './pages/Root';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import PurchaseEvent from './pages/PurchaseEvent';
import ErrorPage from "./error-page";
import 'bootstrap-icons/font/bootstrap-icons.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "create-event",
        element: <CreateEvent />,
      },
      {
        path: "purchase-event",
        element: <PurchaseEvent />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
