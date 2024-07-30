const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const app = express();
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); // Ensure this file exists and is imported
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Static Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes); // Ensure this route is correctly registered

// Dynamically load other routes
readdirSync('./routes').map((route) => {
    if (route !== 'users.js' && route !== 'auth.js') {
        console.log(`Loading route: ${route}`); // Confirm route files are being loaded
        app.use('/api/v1', require('./routes/' + route));
    }
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

app.use((req, res) => {
    res.status(404).send({ error: 'Route not found' });
});

const server = () => {
    db();
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    });
};

server();
