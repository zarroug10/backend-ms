const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const client = require('prom-client');

const authRoutes = require('./Routers/authRouter');

const app = express();
const PORT = 3000;

// Create Sequelize instance
const sequelize = new Sequelize('water company', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

// Enable Prometheus metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create a histogram metric for user-ms service
const userRequestDurationMicroseconds = new client.Histogram({
  name: 'user_request_duration_seconds',
  help: 'Duration of user-ms service HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram for user-ms service
register.registerMetric(userRequestDurationMicroseconds);

// Middleware to measure request duration for user-ms service
app.use((req, res, next) => {
  const end = userRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.url, code: res.statusCode });
  });
  next();
});

// Route to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});

// Authenticate Sequelize connection and start the server
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database');
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/auth', authRoutes);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => { 
    console.error('Error connecting to the database:', err);
  });
