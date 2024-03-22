const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const client = require('prom-client');
const path = require('path');

const incidentRoutes = require('./Routers/incidentReportRoutes');

const app = express();
const PORT = 3001;

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'water company' // This should be your MySQL database name
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

// Create a histogram metric for the Incident Reporting Service
const incidentHttpRequestDurationMicroseconds = new client.Histogram({
  name: 'incident_http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds for the Incident Reporting Service',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram for the Incident Reporting Service
register.registerMetric(incidentHttpRequestDurationMicroseconds);

// Middleware to measure request duration for the Incident Reporting Service
app.use((req, res, next) => {
  const end = incidentHttpRequestDurationMicroseconds.startTimer();
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



// Use incident report routes
app.use('', incidentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
