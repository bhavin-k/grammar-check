const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const grammarRoutes = require('./routes/grammar');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/grammar', grammarRoutes);

app.listen(PORT, () => {
    console.log(process.env.FRONTEND_URL);
    console.log(`Server is running on port ${PORT}`);
});
