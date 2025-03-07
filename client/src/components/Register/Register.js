import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const handleRegister = async () => {
        console.log("Registering user:", { username, email });
        if (!username || !password || !email) {
            alert("Username, password, and email are required.");
            return;
        }
        try {
            const serverUrl = process.env.REACT_APP_SERVER_URL 
            console.log(`${serverUrl}/api/auth/register`);
            await axios.post(`${serverUrl}/api/auth/register`, { username, password, email });
            alert('User registered');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response.data);
            alert('Error registering user: ' + error.response.data);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Register</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                    />
                </div>
                <button onClick={handleRegister} className="auth-btn">Register</button>
                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
