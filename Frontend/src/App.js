import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import MyPHR from './components/MyPHR';
import Header from './components/Header';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/myphr" element={<MyPHR />} />  {/* Route for PHR page */}
            </Routes>
        </Router>
    );
}

export default App;
