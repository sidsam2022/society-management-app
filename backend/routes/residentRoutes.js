const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

router.get('/', residentController.getResidents);

module.exports = router;

