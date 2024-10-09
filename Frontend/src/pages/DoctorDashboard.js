import React, { useState } from 'react';
import '../css/doctorDashboard.css'; // Make sure to create and import the CSS file for styling

const DoctorDashboard = () => {
    // State to hold input values
    const [appointment, setAppointment] = useState({
        dateTime: '',
        type: '',
        doctorName: '',
        reason: '',
        status: ''
    });

    const [patient, setPatient] = useState({
        information: '',
        surgeries: '',
        allergies: '',
        familyHistory: '',
        symptoms: '',
        vaccination: '',
        chronicConditions: '',
        currentConditions: '',
        currentMedicine: '',
        followUps: ''
    });

    // Handle change for appointment fields
    const handleAppointmentChange = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle change for patient review fields
    const handlePatientChange = (e) => {
        const { name, value } = e.target;
        setPatient((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // You can implement saving logic here (e.g., API call)
        alert('Information saved successfully!');
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Doctor Dashboard</h2>
            <div className="dashboard-content">
                {/* Your Appointment Section */}
                <div className="appointment-section">
                    <h3>Your Appointment</h3>
                    <div className="appointment-details">
                        <div className="appointment-item">
                            <label>Appointment Date and Time:</label>
                            <input
                                type="text"
                                name="dateTime"
                                placeholder="Enter Date and Time"
                                value={appointment.dateTime}
                                onChange={handleAppointmentChange}
                                required
                            />
                        </div>
                        <div className="appointment-item">
                            <label>Appointment Type:</label>
                            <input
                                type="text"
                                name="type"
                                placeholder="Enter Appointment Type"
                                value={appointment.type}
                                onChange={handleAppointmentChange}
                                required
                            />
                        </div>
                        <div className="appointment-item">
                            <label>Doctor's Name and Specialty:</label>
                            <input
                                type="text"
                                name="doctorName"
                                placeholder="Enter Doctor's Name and Specialty"
                                value={appointment.doctorName}
                                onChange={handleAppointmentChange}
                                required
                            />
                        </div>
                        <div className="appointment-item">
                            <label>Reason for Appointment:</label>
                            <input
                                type="text"
                                name="reason"
                                placeholder="Enter Reason for Appointment"
                                value={appointment.reason}
                                onChange={handleAppointmentChange}
                                required
                            />
                        </div>
                        <div className="appointment-item">
                            <label>Appointment Status:</label>
                            <input
                                type="text"
                                name="status"
                                placeholder="Enter Appointment Status"
                                value={appointment.status}
                                onChange={handleAppointmentChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                
                {/* Save Button Centered */}
                <div className="save-button-container">
                    <button onClick={handleSave}>Save</button>
                </div>

                {/* Patient's Review Section */}
                <div className="patient-review-section">
                    <h3>Patient's Review</h3>
                    <div className="patient-details">
                        <div className="patient-item">
                            <label>Patient Information:</label>
                            <input
                                type="text"
                                name="information"
                                placeholder="Enter Patient Information"
                                value={patient.information}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Previous Surgeries:</label>
                            <input
                                type="text"
                                name="surgeries"
                                placeholder="Enter Previous Surgeries"
                                value={patient.surgeries}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Allergies:</label>
                            <input
                                type="text"
                                name="allergies"
                                placeholder="Enter Allergies"
                                value={patient.allergies}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Family Medical History:</label>
                            <input
                                type="text"
                                name="familyHistory"
                                placeholder="Enter Family Medical History"
                                value={patient.familyHistory}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Recent Symptoms:</label>
                            <input
                                type="text"
                                name="symptoms"
                                placeholder="Enter Recent Symptoms"
                                value={patient.symptoms}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Vaccination History:</label>
                            <input
                                type="text"
                                name="vaccination"
                                placeholder="Enter Vaccination History"
                                value={patient.vaccination}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Chronic Conditions:</label>
                            <input
                                type="text"
                                name="chronicConditions"
                                placeholder="Enter Chronic Conditions"
                                value={patient.chronicConditions}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Current Medical Conditions:</label>
                            <input
                                type="text"
                                name="currentConditions"
                                placeholder="Enter Current Medical Conditions"
                                value={patient.currentConditions}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Current Medicine:</label>
                            <input
                                type="text"
                                name="currentMedicine"
                                placeholder="Enter Current Medicine"
                                value={patient.currentMedicine}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                        <div className="patient-item">
                            <label>Schedule Follow-Ups:</label>
                            <input
                                type="text"
                                name="followUps"
                                placeholder="Enter Follow-Up Schedule"
                                value={patient.followUps}
                                onChange={handlePatientChange}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
