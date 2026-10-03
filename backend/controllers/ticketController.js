const db = require('../config/db');

exports.getTickets = (req, res) => {
  db.query('SELECT * FROM tickets', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

