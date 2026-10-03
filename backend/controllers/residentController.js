const db = require('../config/db');

exports.getResidents = (req, res) => {
  db.query('SELECT * FROM residents', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

