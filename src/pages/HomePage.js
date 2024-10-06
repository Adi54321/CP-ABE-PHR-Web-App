import React from 'react';
import '../css/HomePage.css'; // Import CSS file for styling
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* <header className="header">
        <div className="logo-container">
          <img src="your-logo.png" alt="Logo" className="logo" />
        </div>
        <div className="nav-buttons">
        <Link to="/login">
          <button className="nav-button">Login</button>
              </Link>
       
          <Link to="/register">
          <button className="nav-button">Register</button>
              </Link>
 
        </div>
      </header> */}

      <main className="main-content">
        <div className="text-box">
          <h1>Personal Health Record (PHR)</h1>
          <p>An Application for managing your Personal Health Record</p>

          <Link to="/register">
          <button className="register-now-button">Register Now</button>
          </Link>

        </div>
        <div className="image-container">
          <img
            src="your-image.png" // Replace with your image path
            alt="Health Records"
            className="image"
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
