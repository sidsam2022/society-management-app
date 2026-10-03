const db = require('../config/db');

exports.getPayments = (req, res) => {
  db.query('SELECT * FROM payments', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

