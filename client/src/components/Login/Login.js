import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../Auth.css';

const Login = ({ setToken, setUsername }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {   
        console.log("Attempting to log in with:", { identifier, password });
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { identifier, password });
            setToken(response.data.token);
            setUsername(response.data.username);
            navigate('/grammar-check');
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message); 
            alert('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Email or Username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
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
                <button onClick={handleLogin} className="auth-btn">Login</button>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
