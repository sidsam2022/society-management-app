const express = require('express');
const app = require('./config/app');

// Import route modules
const residentRoutes = require('./routes/residentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const port = 3000;

// Parse JSON bodies
app.use(express.json());

// Mount routes with /api prefix
app.use('/api/residents', residentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

