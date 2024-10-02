import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the user exists
        const user = users.find((user) => user.username === username && user.password === password);
        
        if (user) {
            alert('Login successful!');
            navigate('/dashboard');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                /><br/>
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                /><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
