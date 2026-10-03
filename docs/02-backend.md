Backend Setup (Node.js + Express)
This document explains how to set up the backend tier for the Society Management App on a RHEL 9 EC2 instance.

1. Install Node.js and npm
Run the following commands to install Node.js and npm:

sudo dnf module install nodejs:18 -y
node -v
npm -v

2. Initialize Project
Create the backend folder and initialize npm:

mkdir backend
cd backend
npm init -y

This generates a package.json file with default values.

3. Install Dependencies
Install required packages:

npm install express mysql2 cors dotenv

express → web framework

mysql2 → database driver

cors → enable cross‑origin requests

dotenv → manage environment variables

4. Create Project Structure
Inside the backend folder, create the following files:

server.js → entry point
routes/residents.js → residents API
routes/payments.js → payments API
routes/expenses.js → expenses API
routes/tickets.js → tickets API
routes/visitors.js → visitors API
db.js → database connection

5. Configure Database Connection
In db.js:

const mysql = require('mysql2');
const pool = mysql.createPool({
host: 'localhost',
user: 'society',
password: 'SocietyApp@1',
database: 'society'
});

module.exports = pool.promise();

6. Create Express Server
In server.js:

const express = require('express');
const cors = require('cors');
const residentsRoutes = require('./routes/residents');
const paymentsRoutes = require('./routes/payments');
const expensesRoutes = require('./routes/expenses');
const ticketsRoutes = require('./routes/tickets');
const visitorsRoutes = require('./routes/visitors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/residents', residentsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/visitors', visitorsRoutes);

app.listen(3000, () => {
console.log('Backend running on port 3000');
});

7. Example Route (Residents)
In routes/residents.js:

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
const [rows] = await db.query('SELECT * FROM residents');
res.json(rows);
});

router.post('/', async (req, res) => {
const { name, flat_no, phone, email, role } = req.body;
await db.query('INSERT INTO residents (name, flat_no, phone, email, role) VALUES (?, ?, ?, ?, ?)', [name, flat_no, phone, email, role]);
res.json({ message: 'Resident added successfully' });
});

module.exports = router;

8. Run Backend
Start the server:

node server.js

Expected output:
Backend running on port 3000

Summary
Installed Node.js and npm
Initialized backend project with Express
Configured database connection
Created routes for residents, payments, expenses, tickets, visitors
Started backend server on port 3000

