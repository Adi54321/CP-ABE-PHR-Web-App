import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/patientDashboard.css';

function PatientDashboard() {
    const navigate = useNavigate();

    const handleAppointmentClick = () => {
        navigate('/book-appointment');
    };

    const handleVaccinationClick = () => {
        navigate('/vaccination');
    };

    return (
        <div className="dashboard-container">
            <h2>Patients Dashboard</h2>
            <div className="main-sections">
                {/* Appointments Section */}
                <div className="appointments-section">
                    <h3>Appointments</h3>
                    <div className="appointment-details">
                        <p>Doctor: [Name]</p>
                        <p>Department: [Department]</p>
                        <p>Appointment Date: [Date]</p>
                        <p>Time: [Time]</p>
                        <p>Reason for Appointment: [Reason]</p>
                    </div>
                    {/* Repeat this structure for additional appointments */}
                </div>

                {/* Buttons Section */}
                <div className="actions-section">
                    <button onClick={handleAppointmentClick} className="action-button">
                        Book Appointment
                    </button>
                    <button onClick={handleVaccinationClick} className="action-button">
                        Vaccination
                    </button>
                </div>

                {/* Patient Information Section */}
                <div className="patient-info-section">
                    <h3>Patient Information</h3>
                    <form>
                        <input type="text" placeholder="First Name" />
                        <input type="text" placeholder="Last Name" />
                        <input type="date" placeholder="DOB" />
                        <input type="text" placeholder="Blood Type" />
                        <input type="text" placeholder="Health Card" />
                        <input type="text" placeholder="Current Medical Conditions" />
                        <input type="text" placeholder="Previous Surgery" />
                        <input type="text" placeholder="Allergies" />
                        <input type="text" placeholder="Family History" />
                        <input type="text" placeholder="Current Medications" />
                        <button type="submit" className="save-button">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;
