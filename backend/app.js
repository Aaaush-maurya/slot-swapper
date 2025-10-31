const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const swapRoutes = require('./routes/swaps');
const bodyParser = require('express').json;

const app = express();
app.use(cors());
app.use(bodyParser());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swaps', swapRoutes);

app.get('/', (req, res) => res.send('SlotSwapper API is running'));

module.exports = app;
