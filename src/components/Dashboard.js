import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Dashboard</h1>
            <p>Welcome to your personal health record dashboard.</p>
            <Link to="/myphr"><button>Submit PHR</button></Link>  {/* Link to PHR page */}
        </div>
    );
};

export default Dashboard;
