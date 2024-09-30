import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Personal Health Record (PHR)</h1>
            <p>An application for managing your Personal Health Record.</p>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
            <br /><br />
            <Link to="/myphr"><button>Submit PHR</button></Link>  {/* Link to PHR page */}
        </div>
    );
};

export default Home;
