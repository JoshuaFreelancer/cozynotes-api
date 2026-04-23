import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Error404 } from "./pages/errors/Error404";
import { Error403 } from "./pages/errors/Error403";
import { Error500 } from "./pages/errors/Error500";
import { AuthPage } from "./pages/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <Error500 />,
  },
  {
    path: "/login",
    element: <AuthPage />, // Replaced the placeholder
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
