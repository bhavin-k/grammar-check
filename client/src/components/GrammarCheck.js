import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GrammarCheck.css';

const GrammarCheck = ({ token, username }) => {
    const [text, setText] = useState('');
    const [correctedText, setCorrectedText] = useState('');
    const [incorrectWords, setIncorrectWords] = useState([]);
    const navigate = useNavigate();

    if (!token) {
        navigate('/login');
        return null;
    }

    const handleCheckGrammar = async (inputText) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/grammar`, { text: inputText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCorrectedText(response.data.correctedText);
            setIncorrectWords(response.data.incorrectWords || []);
        } catch (error) {
            console.error("Error checking grammar:", error);
        }
    };

    const handleTextChange = (e) => {
        const inputText = e.target.value;
        setText(inputText);

        if (inputText.trim() === '') {
            setCorrectedText('');
            setIncorrectWords([]);
        } else {
            // Get the last sentence or line
            const lastLine = inputText.split(/[\n.?!]+/).slice(-1)[0].trim(); // Get the last sentence
            if (lastLine) {
                handleCheckGrammar(lastLine); // Send only the last line to the API
            }
        }
    };

    const renderTextWithCorrections = (text) => {
        // Split by spaces and new lines
        const words = text.split(/[\s\n]+/);
        const correctedWords = correctedText.split(/[\s\n]+/); // Split corrected text into words

        return words.map((word, index) => {
            const cleanWord = word.replace(/[.,!?;]$/, ''); // Clean punctuation for comparison
            const isIncorrect = incorrectWords && incorrectWords.includes(cleanWord);
            const correctedWord = isIncorrect ? correctedWords[index] : word; // Get the corresponding corrected word

            return (
                <span key={index}>
                    {isIncorrect ? (
                        <>
                            <span className="incorrect-word" style={{ textDecoration: 'line-through' }}>{cleanWord}</span> 
                            <span className="corrected-word">{correctedWord}</span>{' '}
                        </>
                    ) : (
                        word + ' ' // Display the original word if it's not incorrect
                    )}
                </span>
            );
        });
    };

    return (
        <div className="grammar-container">
            <h2>Welcome, {username}</h2>
            <div className="output-box">
                <strong>Output</strong>
                <p>
                    {renderTextWithCorrections(text)}
                </p>
            </div>
            <div className="input-box">
                <textarea 
                    className="grammar-input" 
                    onChange={handleTextChange}
                    placeholder="User's plain text input goes here."
                    value={text}
                ></textarea>
            </div>
            <button className="check-btn" onClick={() => navigate('/login')}>Logout</button>
        </div>
    );
};

export default GrammarCheck;
