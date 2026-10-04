const express = require('express');
const router = express.Router();

let residents = [
  { id: 1, name: "Ravi Kumar", flat_no: "A101", phone: "9876543210", email: "ravi@example.com" },
  { id: 2, name: "Priya Sharma", flat_no: "B202", phone: "9123456780", email: "priya@example.com" }
];

// GET all residents
router.get('/api/residents', (req, res) => {
  res.json(residents);
});

// POST new resident
router.post('/api/residents', (req, res) => {
  const { name, flat_no, phone, email } = req.body;
  if (!name || !flat_no || !phone || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const newResident = { id: Date.now(), name, flat_no, phone, email };
  residents.push(newResident);
  res.status(201).json(newResident);
});

module.exports = router;
