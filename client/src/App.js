import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import GrammarCheck from './components/GrammerCheck/GrammarCheck';

const App = () => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setToken={setToken} setUsername={setUsername} />} />
                <Route path="/login" element={<Login setToken={setToken} setUsername={setUsername} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/grammar-check" element={token ? <GrammarCheck token={token} username={username} /> : <Login setToken={setToken} setUsername={setUsername} />} />
            </Routes>
        </Router>
    );
};

export default App;
