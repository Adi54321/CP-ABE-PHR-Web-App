import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/vaccinationDashboard.css';

function VaccinationDashboard() {
    const navigate = useNavigate();

    const handleBackToDashboardClick = () => {
        navigate('/patient-dashboard');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="vaccination-dashboard-container">
            <h2>Vaccination Dashboard</h2>

            {/* Vaccination Form */}
            <form className="vaccination-form" onSubmit={handleSubmit}>
                <h3>Record Vaccination</h3>
                <input type="text" placeholder="Vaccine Name" required />
                <input type="text" placeholder="Dose Number (e.g., 1st, 2nd)" required />
                <input type="date" placeholder="Date of Vaccination" required />
                <input type="text" placeholder="Location (e.g., Clinic Name)" required />
                <input type="text" placeholder="Reason for vaccination " required />

                <button type="submit" className="save-vaccination-button">Save Vaccination</button>
            </form>

            {/* Buttons Section */}
            <div className="vaccination-actions">
                <button onClick={handleBackToDashboardClick} className="vaccination-action-button">
                    Back to Patient Dashboard
                </button>
            </div>
        </div>
    );
}

export default VaccinationDashboard;
