import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/patientDashboard.css';

function PatientDashboard() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');

    //patient data to send to the backend for storing and encryption
    const [patientData, setPatientData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        bloodType: '',
        healthCard: '',
        currentMedicalConditions: '',
        previousSurgery: '',
        allergies: '',
        familyHistory: '',
        currentMedications: ''
    });

    //fetch list of doctors for the dropdown list
    useEffect(() => {
        fetch('http://localhost:5000/cpabe/doctors') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Doctors fetched:', data);  // Debugging
                setDoctors(data);
            })
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    //
    const handleAppointmentClick = () => {
        navigate('/book-appointment');
    };

    const handleVaccinationClick = () => {
        navigate('/vaccination');
    };

    //handle patient data form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    //saving patient data and encrypting it based on selected doctor
    const handleSaveClick = async (e) => {
        e.preventDefault();

        if (!selectedDoctorId) {
            alert('Please select a doctor for encryption.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/cpabe/encrypt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patient_email: "DOE@gmail.com", //need to figure out way to not hardcode email
                    doctor_id: selectedDoctorId,
                    patient_data: JSON.stringify(patientData)
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Data encrypted and saved successfully!');
            } else {
                alert('Error encrypting data: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save patient data.');
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Patients Dashboard</h2>
            <div className="main-sections">
                {/* appointment section */}
                <div className="appointments-section">
                    <h3>Appointments</h3>
                    <div className="appointment-details">
                        <p>Doctor: [Name]</p>
                        <p>Department: [Department]</p>
                        <p>Appointment Date: [Date]</p>
                        <p>Time: [Time]</p>
                        <p>Reason for Appointment: [Reason]</p>
                    </div>
                </div>
               {/* button selections */}
                <div className="actions-section">
                    <button onClick={handleAppointmentClick} className="action-button">
                        Book Appointment
                    </button>
                    <button onClick={handleVaccinationClick} className="action-button">
                        Vaccination
                    </button>
                </div>

                {/* patient information section to encrypt and store into database */}
                <div className="patient-info-section">
                    <h3>Patient Information</h3>
                    <form onSubmit={handleSaveClick}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={patientData.firstName}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={patientData.lastName}
                            onChange={handleChange}
                        />
                        <input
                            type="date"
                            name="dob"
                            placeholder="DOB"
                            value={patientData.dob}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="bloodType"
                            placeholder="Blood Type"
                            value={patientData.bloodType}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="healthCard"
                            placeholder="Health Card"
                            value={patientData.healthCard}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="currentMedicalConditions"
                            placeholder="Current Medical Conditions"
                            value={patientData.currentMedicalConditions}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="previousSurgery"
                            placeholder="Previous Surgery"
                            value={patientData.previousSurgery}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="allergies"
                            placeholder="Allergies"
                            value={patientData.allergies}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="familyHistory"
                            placeholder="Family History"
                            value={patientData.familyHistory}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="currentMedications"
                            placeholder="Current Medications"
                            value={patientData.currentMedications}
                            onChange={handleChange}
                        />

                        {/* doctor selection for patient, gives a list to patient of who can access the data */}
                        <div className="doctor-selection">
                            <h3>Select a Doctor you wish to have access</h3>
                            {doctors.length === 0 ? (
                                <p>No doctors available. Please try again later.</p>
                            ) : (
                                <select
                                    value={selectedDoctorId}
                                    onChange={(e) => {
                                        console.log('Doctor selected:', e.target.value);  //debugging
                                        setSelectedDoctorId(e.target.value);
                                    }}
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map((doctor) => {
                                        console.log(`Rendering doctor: ${doctor.first_name} ${doctor.last_name}`);
                                        return (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.first_name} {doctor.last_name} - {doctor.specialization} ({doctor.hospital_affiliation})
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                        </div>

                        <button type="submit" className="save-button">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;
