import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/appointmentDashboard.css'; // Ensure you have a CSS file for styling

function AppointmentDashboard() {
    const navigate = useNavigate();
    const [appointmentData, setAppointmentData] = useState({
        doctorName: '',
        department: '',
        appointmentDate: '',
        time: '',
        reason: ''
    });

    const handleChange = (e) => {
        setAppointmentData({
            ...appointmentData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Appointment saved:', appointmentData);
        navigate('/patient-dashboard'); // Navigate back to the patient dashboard after saving
    };

    return (
        <div className="appointment-dashboard">
            <h2>Appointment Book Dashboard</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="doctorName"
                    placeholder="Doctor Name"
                    value={appointmentData.doctorName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={appointmentData.department}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="appointmentDate"
                    placeholder="Appointment Date"
                    value={appointmentData.appointmentDate}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="time"
                    placeholder="Time"
                    value={appointmentData.time}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="reason"
                    placeholder="Reason for Appointment"
                    value={appointmentData.reason}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="save-button">
                    Save & Go Back to Patient Dashboard
                </button>
            </form>
        </div>
    );
}

export default AppointmentDashboard;
