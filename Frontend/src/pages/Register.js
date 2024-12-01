import React, { useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import axios from 'axios'; //import axios to the project
import '../css/register.css'; // Make sure to import the CSS file


function Register() {
    const [role, setRole] = useState('');
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    //for patient user registration
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    //for additional doctor information registration
    const [specialization, setSpecialization] = useState('');
    const [medicalLicenseNumber, setMedicalLicenseNumber] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [hospitalAffiliation, setHospitalAffiliation] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [preferredContactMethod, setPreferredContactMethod] = useState('');
    const [DOB, setDOB] = useState('');
    const [languagesSpoken, setLanguagesSpoken] = useState('');


    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };
    //set it to where it only takes 10 digits
    const handlePhoneNumberChange = (event) =>{
        const value =  event.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 10) {
            setPhoneNumber(value);
            setPhoneError('');
        }
        else{
            setPhoneError('Phone number must be 10 digits long');
        }
       
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        //alert if the role is not selected
        if (!role) {
            alert('Please select a role!');
            return;
        }
        //check if phone number is not 10 digits
        if (phoneNumber.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits long');
            return;
        }

        //try catch to see if there is an error sending the inputs to the backend
        try {
            const response = await axios.post('http://localhost:5000/register',{
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                phone_number: phoneNumber,
                role
            });
            
            alert(response.data.message);

            //redirect to corresponding pages
            if (role === 'doctor') {
                setShowDoctorForm(true); // Show the doctor registration form
                navigate('/register');
            } else if (role === 'patient') {
                navigate('/patient-dashboard'); // Navigate to patient dashboard
            }
        } catch (error) {
            console.error('There was an error!', error);
            alert(error.response?.data?.error || 'Error creating account');
        }
    };

    //frontend request to the backend for if user is doctor and has to add additional 
    //info before going to doctordashboard
    const handleDoctorSubmit = async (event) => {
        event.preventDefault();
        
        try {
            //object literal for additional doctor info 
            const doctorData = {
            email, //already from the registration form 
            specialization_: specialization,
            medical_license_number: medicalLicenseNumber,
            years_of_experience :yearsOfExperience,
            hospital_affiliation :hospitalAffiliation,
            contact_info: contactInfo,
            preferred_contact_method: preferredContactMethod,
            languages_spoken: languagesSpoken,
            DOB: DOB,
        };
        
            console.log(doctorData);
            //send doctorData to the backend and wait for response if ok send to doctor dashboard
            const response = await axios.post('http://localhost:5000/register/doctor-info', doctorData);
            //alert the user
            alert(response.data.message);
            //navigate to doctor dashboard
            navigate('/doctor-dashboard');
        } catch (error) {
            //debugging purposes
            console.error('Error registering doctor info!', error);
            alert(error.response ? error.response.data.error : 'Error registering doctor!!!');

            console.error('Error registering doctor info!', error);
            alert(error.message?.data?.error||'Error registering doctor!!!');
        }
    };
    

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register Page</h2>
                {!showDoctorForm ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex-container">
                            <input 
                                type="text" 
                                placeholder="First Name" 
                                value = {firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="Last Name" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required 

                            />
                        </div>

                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            />
                        
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={phoneNumber} 
                            onChange={handlePhoneNumberChange} 
                            className={phoneError ? 'input-error' : ''}
                            required 
                            />
                        {phoneError && <p className="error">{phoneError}</p>} 
                        <div className="flex-container">
                            <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                            <input 
                                type="password" 
                                placeholder="Re-enter Password" 
                                required />
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
                        </div>
                        <input type="date" 
                            placeholder="D.O.B (Date of birth)" 
                            value = {DOB}
                            onChange={(e) => setDOB(e.target.value)}
                            required />
                        <input type="text" 
                            placeholder="Medical License Number (MLN)" 
                            value = {medicalLicenseNumber}
                            onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                            required />
                        <input type="text" 
                            placeholder="Specialization" 
                            value = {specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            required />
                        <input type="text" 
                            placeholder="Years of Experience" 
                            value = {yearsOfExperience}
                            onChange={(e) => setYearsOfExperience(e.target.value)}
                            required />
                        <input type="text"
                            placeholder="Hospital/Clinic Affiliation" 
                            value={hospitalAffiliation}
                            onChange={(e) => setHospitalAffiliation(e.target.value)}
                            required />
                        <input type="text" 
                            placeholder="Contact Information" 
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)} 
                            required />
                        <input type="text" 
                            placeholder="Preferred Contact Method" 
                            value={preferredContactMethod}
                            onChange={(e) => setPreferredContactMethod(e.target.value)}
                            required />
                        <input type="text" 
                            placeholder="Languages Spoken" 
                            value = {languagesSpoken}
                            onChange={(e) => setLanguagesSpoken(e.target.value)}
                            required />
                        <button type="submit">Register as Doctor</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;
