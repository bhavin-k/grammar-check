const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { text } = req.body;
    console.log("Checking grammar for text:", text);
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o", 
            messages: [
                { 
                    role: "user", 
                    content: `Please correct the grammar of the following text and identify any incorrect words:\n\n${text}\n\nFor example:\nText: "I am a goood person"\nIncorrect words: ["goood"]\nCorrected text: "I am a good person"`
                }
            ], 
            temperature: 0.5,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const messageContent = response.data.choices[0].message.content;

        const correctedTextMatch = messageContent.match(/Corrected text: "(.*?)"/);
        const incorrectWordsMatch = messageContent.match(/Incorrect words: \[(.*?)\]/);

        const correctedText = correctedTextMatch ? correctedTextMatch[1] : 'No correction provided.';
        const incorrectWords = incorrectWordsMatch ? incorrectWordsMatch[1].split(',').map(word => word.trim().replace(/"/g, '')) : ['No incorrect words identified.'];
        console.log("Corrected text:", correctedText);
        console.log("Incorrect words:", incorrectWords);

        res.json({ correctedText, incorrectWords }).status(200);
    } catch (error) {
        console.error('Error checking grammar:', error);
        res.status(500).send('Error checking grammar');
    }
});

module.exports = router;
