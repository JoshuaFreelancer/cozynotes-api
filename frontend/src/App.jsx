import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { TrashPage } from "./pages/TrashPage";
import { ArchivedPage } from "./pages/ArchivedPage";
import { Error404 } from "./pages/errors/Error404";
import { Error403 } from "./pages/errors/Error403";
import { Error500 } from "./pages/errors/Error500";
import { AuthPage } from "./pages/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // The Layout is now the parent wrapper
    errorElement: <Error500 />,
    children: [
      {
        index: true, // This means Dashboard loads exactly at the "/" path
        element: <Dashboard />,
      },
      {
        path: "trash", // Loads at "/trash" inside the MainLayout
        element: <TrashPage />,
      },
      {
        path: "archived",
        element: <ArchivedPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/401",
    element: <Error403 />,
  },
  {
    path: "/500",
    element: <Error500 />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

function App() {
  return (
    <div className="w-full min-h-screen bg-[#F7F6F3]">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
