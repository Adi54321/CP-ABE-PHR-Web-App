import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Layout from "./components/Layout.js";
import HomePage from "./pages/HomePage.js";
import PatientDashboard from "./pages/PatientDashboard.js";
import DoctorDashboard from "./pages/DoctorDashboard.js";
import AppointmentDashboard from "./pages/AppointmentDashboard.js";
import VaccinationDashboard from "./pages/VaccinationDashboard.js";
import ErrorPage from "./pages/ErrorPage.js";
import PatientPanel from "./pages/PatientPanel.js"; // Import the PatientPanel component
import DoctorPanel from "./pages/DoctorPanel.js"; // Import the DoctorPanel component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/doctor-dashboard",
        element: <DoctorDashboard />,
      },
      {
        path: "/patient-dashboard",
        element: <PatientDashboard />,
      },
      {
        path: "/book-appointment",
        element: <AppointmentDashboard />,
      },
      {
        path: "/vaccination",
        element: <VaccinationDashboard />,
      },
      {
        path: "/patient-panel", // New route for PatientPanel
        element: <PatientPanel />,
      },
      {
        path: "/doctor-panel", // New route for DoctorPanel
        element: <DoctorPanel />,
      },
      {
        path: "*", // Catch-all route for non-existent paths
        element: <ErrorPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
