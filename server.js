const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // IMPORTANT
app.use(express.static('public'));

// MySQL connection (Azure-compatible)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    ssl: {
        rejectUnauthorized: false   // 🔴 CRITICAL FIX for Azure MySQL
    }
});

// Connect once at startup
db.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err);
        process.exit(1); // crash fast if DB is unreachable
    }
    console.log('Connected to Azure MySQL');
});

// Route
app.post('/register', (req, res) => {
    const { username, password, email, age } = req.body;

    // Basic validation (prevents silent DB failures)
    if (!username || !password || !email || !age) {
        return res.status(400).send('Missing required fields');
    }

    const sql =
        'INSERT INTO users (username, password, email, age) VALUES (?, ?, ?, ?)';

    db.query(
        sql,
        [username, password, email, Number(age)],
        (err, result) => {
            if (err) {
                console.error('DB ERROR:', err);
                return res.status(500).send('Error saving data');
            }

            res.status(200).send('User registered successfully');
        }
    );
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
