import React, { useState, useEffect } from 'react';
import '../css/doctorDashboard.css'; // Make sure to create and import the CSS file for styling
import axios from 'axios';

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

    // State to hold list of patients for the doctor
    const [patientsList, setPatientsList] = useState([]);
    //state to hold doctor's id
    const [doctorId, setDoctorId] = useState(null);

    // State to hold doctor's email
    const [doctorEmail, setDoctorEmail] = useState('');

    useEffect(() => {
        const fetchDoctorId = async () => {
            try {
                const email = localStorage.getItem("userEmail"); // Retrieve doctor's email from local storage
                if (email) {
                    const response = await axios.get(`http://127.0.0.1:5000/cpabe/get_doctor_id`, {
                        params: {
                            email: email
                        }
                    });
                    if (response.data.doctor_id) {
                        setDoctorId(response.data.doctor_id); // Set doctor's id in state
                        console.log("Doctor ID:", response.data.doctor_id);
                    }
                } else {
                    console.error("Doctor's email not found in local storage.");
                }
            } catch (error) {
                console.error("Error fetching doctor ID: ", error);
            }
        };

        fetchDoctorId();
    }, []);
    // Fetch patients list based on policy
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const email = localStorage.getItem("userEmail"); // Retrieve doctor's email from local storage
                if (email) {
                    setDoctorEmail(email); // Set doctor's email in state
                    const response = await axios.get(`http://127.0.0.1:5000/cpabe/patients`, { // Added api prefix to match backend registration
                        params: {
                            email: email
                        }
                    });
                    console.log("Patients List Response: ", response.data); // Debug log
                    setPatientsList(response.data);
                    console.log("Updated Patients List State: ", response.data);
                } else {
                    console.error("Doctor's email not found in local storage.");
                }
            } catch (error) {
                console.error("Error fetching patients list: ", error);
            }
        };

        fetchPatients();
    }, []);

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

    // Handle decrypt
    const handleDecrypt = async (patientId, doctorEmail) => {
        try {
            console.log("Decrypt button clicked for patient ID:", patientId); // Debug log for decrypt button click
            const response = await axios.post(`http://127.0.0.1:5000/cpabe/decrypt`, {
                doctor_id: doctorId,
                patient_id: patientId
            });
            console.log("Decryption Response: ", response.data); // Debug log for decryption response
            alert(`Decrypted Data: ${response.data.decrypted_data}`); // Show decrypted data in an alert
        } catch (error) {
            console.error("Error decrypting data: ", error); // Log error if decryption fails
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Doctor Dashboard</h2>
            <div className="dashboard-content">
                {/* Patients List Section */}
                <div className="patients-list-section">
                    <h3>Your Patients</h3>
                    {patientsList.length > 0 ? (
                        <ul className="patients-list">
                            {patientsList.map((patient, index) => (
                                <li key={index} className="patient-item" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '5px', maxWidth: '600px', wordWrap: 'break-word' }}>
                                    <p><strong>Name:</strong> {patient.name}</p>
                                    <p><strong>Policy:</strong> {patient.policy}</p>
                                    <button onClick={() => handleDecrypt(patient.patient_id, doctorEmail)}>View</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No patients assigned to you based on the current policy.</p>
                    )}
                </div>

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
