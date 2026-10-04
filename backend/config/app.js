const express = require('express');
const cors = require('cors');

const residentRoutes = require('../routes/residentRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const ticketRoutes = require('../routes/ticketRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/residents', residentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);

module.exports = app;
