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
import ErrorPage from "./pages/ErrorPage.js"; // Import the ErrorPage component


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />, // Set the error element for this route
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
        path: "/book-appointment", // Route for the appointment dashboard
        element: <AppointmentDashboard />,
      },
      {
        path: "/vaccination", // Route for the vaccination dashboard
        element: <VaccinationDashboard />,
      },
      {
        path: "*", // Catch-all route for non-existent paths
        element: <ErrorPage />, // Render the error page for any unmatched route
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
