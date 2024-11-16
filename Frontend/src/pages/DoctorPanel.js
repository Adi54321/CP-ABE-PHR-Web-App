import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/DoctorPanel.css'; // Ensure CSS is set up for responsiveness

const DoctorPanel = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [doctor, setDoctor] = useState({ name: "", specialty: "" });
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch patients data when the component mounts
    // This function should be provided by your teammate
    useEffect(() => {
        fetchPatients()
            .then(data => setPatients(data))
            .catch(error => console.error('Error fetching patients:', error));
    }, []);

    // Dummy function to represent fetching patients
    // Replace or remove this with your teammate's function
    const fetchPatients = () => {
        // Placeholder for the actual fetch call
        console.log("Fetching patients from the backend...");
        return Promise.resolve([]); // Example empty array, expect actual data here
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            // Assuming there's a backend endpoint to handle profile updates
            console.log("Submitting update for doctor:", doctor);
            // Here, you would typically make a POST request to update the doctor's profile
            alert("Profile updated successfully!");
            setEditMode(false);
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!doctor.name) tempErrors.name = "Name is required";
        if (!doctor.specialty) tempErrors.specialty = "Specialty is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDoctor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const goToPatientDetails = (patientId) => {
        navigate(`/patient-details/${patientId}`);
    };

    return (
        <div className="doctor-panel">
            <h1>Doctor Panel</h1>
            {editMode ? (
                <form onSubmit={handleEditSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={doctor.name} onChange={handleInputChange} />
                    {errors.name && <p className="error">{errors.name}</p>}

                    <label htmlFor="specialty">Specialty:</label>
                    <input type="text" name="specialty" value={doctor.specialty} onChange={handleInputChange} />
                    {errors.specialty && <p className="error">{errors.specialty}</p>}

                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                </form>
            ) : (
                <button onClick={() => setEditMode(true)}>Edit Profile</button>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Appointment Date</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>{patient.appointmentDate}</td>
                            <td>
                                <button onClick={() => goToPatientDetails(patient.id)}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/doctor-dashboard" className="back-link">Back to Dashboard</Link>
        </div>
    );
};

export default DoctorPanel;
