const app = require('./config/app');
const residentRoutes = require('./routes/residentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const port = 3000;

// Mount routes
app.use('/residents', residentRoutes);
app.use('/payments', paymentRoutes);
app.use('/tickets', ticketRoutes);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

