import React, { useState } from 'react';
import '../css/LoginStyle.css'; // External CSS for styling

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async(event) => {
    event.preventDefault();
    //sending the email password in a payload
    const payload = {email, password};
    
    try{
      // API call to the flask backend
        const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload),
        });

      //parse the response, uses the login function in app.py to check if user exist
        const result = await response.json();

      if (response.ok) {
        //successful login
        console.log('Successful Login:', result)

        //set user email in local storage
        localStorage.setItem('userEmail', email)

        //logic for if the login is successful and open the respected webpages depending on the role of the user
        if(result.role === 'doctor'){
          window.location.href = '/doctor-dashboard'; // Redirect to doctor dashboard
        } else if(result.role === 'patient'){
          window.location.href = '/patient-dashboard'; // Redirect to doctor dashboard
        }
        else{
          //in the case where login fails
          setErrorMessage(result.error || 'Invalid email or password');
        }
      }
      }catch(error){
        console.log('login failed', error);
        setErrorMessage('An error has occurred. Please try again later');
      }
    };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
