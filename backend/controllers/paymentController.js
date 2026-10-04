const db = require('../config/db');

exports.getPayments = (req, res) => {
  db.query('SELECT * FROM payments', (err, results) => {
    if (err) {
      console.error('Database query error (payments):', err);
      return res.status(500).json({ error: 'Failed to retrieve payments' });
    }
    res.json(results);
  });
};

exports.createPayment = (req, res) => {
  const { resident_id, amount, status, payment_date } = req.body;
  if (!resident_id || !amount) {
    return res.status(400).json({ error: 'resident_id and amount are required' });
  }

  const query = 'INSERT INTO payments (resident_id, amount, status, payment_date) VALUES (?, ?, ?, ?)';
  db.query(query, [resident_id, amount, status || 'Pending', payment_date || new Date()], (err, result) => {
    if (err) {
      console.error('Database insert error (payments):', err);
      return res.status(500).json({ error: 'Failed to process payment' });
    }
    res.status(201).json({ id: result.insertId, resident_id, amount, status: status || 'Pending' });
  });
};
