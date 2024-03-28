const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const client = require('prom-client');

const feedBackRoute = require('./Routes/feedBackRoute');

const app = express();
const PORT = 3002;

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'water company'  
}); 

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  
  // Start the Express server after MySQL connection is established
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Enable Prometheus metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create a histogram metric for feedback service
const feedbackRequestDurationMicroseconds = new client.Histogram({
  name: 'feedback_request_duration_seconds',
  help: 'Duration of feedback service HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
 
// Register the histogram for feedback service
register.registerMetric(feedbackRequestDurationMicroseconds);

// Middleware to measure request duration for feedback service
app.use((req, res, next) => {
  const end = feedbackRequestDurationMicroseconds.startTimer();
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

// Enable CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

// Use feedback route
app.use('', feedBackRoute);

module.exports = app;
