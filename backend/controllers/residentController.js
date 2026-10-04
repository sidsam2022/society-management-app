const db = require('../config/db');

exports.getResidents = (req, res) => {
  db.query('SELECT * FROM residents', (err, results) => {
    if (err) {
      console.error('Database query error (residents):', err);
      return res.status(500).json({ error: 'Failed to retrieve residents' });
    }
    res.json(results);
  });
};

exports.createResident = (req, res) => {
  const { name, flat_no, phone, email } = req.body;
  if (!name || !flat_no || !phone || !email) {
    return res.status(400).json({ error: 'All fields (name, flat_no, phone, email) are required' });
  }

  const query = 'INSERT INTO residents (name, flat_no, phone, email) VALUES (?, ?, ?, ?)';
  db.query(query, [name, flat_no, phone, email], (err, result) => {
    if (err) {
      console.error('Database insert error (residents):', err);
      return res.status(500).json({ error: 'Failed to create resident' });
    }
    res.status(201).json({ id: result.insertId, name, flat_no, phone, email });
  });
};

exports.updateResident = (req, res) => {
  const { id } = req.params;
  const { name, flat_no, phone, email } = req.body;

  const query = 'UPDATE residents SET name = ?, flat_no = ?, phone = ?, email = ? WHERE id = ?';
  db.query(query, [name, flat_no, phone, email, id], (err, result) => {
    if (err) {
      console.error('Database update error (residents):', err);
      return res.status(500).json({ error: 'Failed to update resident' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    res.json({ message: 'Resident updated successfully' });
  });
};

exports.deleteResident = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM residents WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database delete error (residents):', err);
      return res.status(500).json({ error: 'Failed to delete resident' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    res.json({ message: 'Resident deleted successfully' });
  });
};
