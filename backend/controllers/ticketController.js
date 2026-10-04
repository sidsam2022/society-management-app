const db = require('../config/db');

exports.getTickets = (req, res) => {
  db.query('SELECT * FROM tickets', (err, results) => {
    if (err) {
      console.error('Database query error (tickets):', err);
      return res.status(500).json({ error: 'Failed to retrieve tickets' });
    }
    res.json(results);
  });
};

exports.createTicket = (req, res) => {
  const { resident_id, title, description, status } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const query = 'INSERT INTO tickets (resident_id, title, description, status) VALUES (?, ?, ?, ?)';
  db.query(query, [resident_id, title, description, status || 'Open'], (err, result) => {
    if (err) {
      console.error('Database insert error (tickets):', err);
      return res.status(500).json({ error: 'Failed to create ticket' });
    }
    res.status(201).json({ id: result.insertId, resident_id, title, description, status: status || 'Open' });
  });
};
