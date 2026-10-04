const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

router.get('/', residentController.getResidents);
router.post('/', residentController.createResident);
router.put('/:id', residentController.updateResident);
router.delete('/:id', residentController.deleteResident);

module.exports = router;
