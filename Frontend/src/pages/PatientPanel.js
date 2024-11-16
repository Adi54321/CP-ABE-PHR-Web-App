import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/PatientPanel.css';

const PatientPanel = () => {
    const navigate = useNavigate();
    const [patientInfo, setPatientInfo] = useState({
        name: '',
        age: '',
        contactInfo: '',
        doctorId: ''
    });
    const [editMode, setEditMode] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', patientInfo);
        navigate('/patient-dashboard');
    };

    const toggleEdit = () => {
        setEditMode(!editMode);
    };

    return (
        <div className="patient-panel">
            <h1>{editMode ? "Edit Your Information" : "Patient Information"}</h1>
            <button onClick={toggleEdit}>{editMode ? "Stop Editing" : "Edit Information"}</button>
            <form onSubmit={handleSubmit} style={{ display: editMode ? 'block' : 'none' }}>
                <input
                    type="text"
                    name="name"
                    value={patientInfo.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                />
                <input
                    type="number"
                    name="age"
                    value={patientInfo.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                    required
                />
                <input
                    type="text"
                    name="contactInfo"
                    value={patientInfo.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Contact Information"
                    required
                />
                <select
                    name="doctorId"
                    value={patientInfo.doctorId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select a Doctor</option>
                    {/* Populate this with actual data */}
                </select>
                <button type="submit">Submit Changes</button>
            </form>
            <Link to="/patient-dashboard" className="back-link">Back to Dashboard</Link>
        </div>
    );
};

export default PatientPanel;
