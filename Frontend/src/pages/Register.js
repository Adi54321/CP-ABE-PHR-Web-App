import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css'; // Make sure to import the CSS file

function Register() {
    const [role, setRole] = useState('');
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const navigate = useNavigate();

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (role === 'doctor') {
            setShowDoctorForm(true); // Show the doctor registration form
        } else if (role === 'patient') {
            navigate('/patient-dashboard'); // Navigate to patient dashboard
        } else {
            alert('Please select a role!');
        }
    };

    const handleDoctorSubmit = (event) => {
        event.preventDefault();
        alert('Doctor account created successfully!');
        // Navigate to doctor dashboard
        navigate('/doctor-dashboard');
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register Page</h2>
                {!showDoctorForm ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex-container">
                            <input type="text" placeholder="First Name" required />
                            <input type="text" placeholder="Last Name" required />
                        </div>
                        <input type="email" placeholder="Email Address" required />
                        <div className="flex-container">
                            <input type="password" placeholder="Password" required />
                            <input type="password" placeholder="Re-enter Password" required />
                        </div>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="doctor"
                                    checked={role === 'doctor'}
                                    onChange={handleRoleChange}
                                />
                                Doctor
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="patient"
                                    checked={role === 'patient'}
                                    onChange={handleRoleChange}
                                />
                                Patient
                            </label>
                        </div>
                        <button type="submit">Create an Account</button>
                    </form>
                ) : (
                    <form onSubmit={handleDoctorSubmit}>
                        <h3>Doctor Registration</h3>
                        <div className="flex-container">
                            <input type="text" placeholder="First Name" required />
                            <input type="text" placeholder="Last Name" required />
                        </div>
                        <input type="date" placeholder="D.O.B" required />
                        <input type="text" placeholder="Medical License Number (MLN)" required />
                        <input type="text" placeholder="Specialization" required />
                        <input type="text" placeholder="Years of Experience" required />
                        <input type="text" placeholder="Hospital/Clinic Affiliation" required />
                        <input type="text" placeholder="Contact Information" required />
                        <input type="text" placeholder="Preferred Contact Method" required />
                        <input type="text" placeholder="Languages Spoken" required />
                        <button type="submit">Register as Doctor</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;
