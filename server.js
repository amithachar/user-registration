const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'sqlserver02.mysql.database.azure.com',
    user: 'backend',
    password: 'Amith@1997',
    database: 'user_db',
    ssl: { rejectUnauthorized: true }
});

db.connect(err => {
    if (err) console.error(err);
    else console.log('Connected to Azure MySQL');
});

app.post('/register', (req, res) => {
    const { username, password, email, age } = req.body;

    const sql = 
      "INSERT INTO users (username, password, email, age) VALUES (?, ?, ?, ?)";

    db.query(sql, [username, password, email, age], (err) => {
        if (err) {
            console.error(err);
            res.send('Error saving data');
        } else {
            res.send('User registered successfully');
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
