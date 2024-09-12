import { useState } from 'react'
import './App.css'
import React from 'react';
import { createBrowserRouter, Router, RouterProvider, useLoaderData } from 'react-router-dom';
import Login from './pages/Login';
import Error from './pages/Error';
import Home from './pages/Home';
import Inventory from './components/Inventory';
import InventoryAlerts from './components/InventoryAlerts';
import { inventoryLoader } from './loaders/inventoryLoader';
import { userLoader } from './loaders/userLoader';
import Profile from './components/Profile';
import NewItem from './components/NewItem';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <Error />
    },
    {
      path: "/home",
      element: <Home />,
      children: [
        {
          path: "inventory",
          element: <Inventory />,
          errorElement: <Error />,
          loader: inventoryLoader,
          children: [
            {
              path: "alerts",
              element: <InventoryAlerts />,
              errorElement: <Error />,
              loader: inventoryLoader
            },
            {
              path: "new",
              element: <NewItem />,
              errorElement: <Error />,
              loader: inventoryLoader
            },
          ]
        },
        {
          path: "users/:userId",
          element: <Profile />,
          errorElement: <Error />,
          loader: userLoader
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default App
