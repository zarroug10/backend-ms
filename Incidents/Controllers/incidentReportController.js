const pool = require('../Models/incident');
const RepairReport = require('../Models/repairReport');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage, 
  limits: { fileSize: 1024 * 1024 * 5 },
}).single('media');

exports.getIncidents = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      pool.query('SELECT Incidents.*, Users.username FROM Incidents INNER JOIN Users ON Incidents.userId = Users.id', (error, results, fields) => {
        if (error) {
          console.error('Error retrieving incidents:', error);
          return res.status(500).json({ error: 'An error occurred while retrieving incidents' });
        }
        res.status(200).json(results);
      });
    }); 
  } catch (err) {
    console.error('Error retrieving incidents:', err);
    res.status(500).json({ error: 'An error occurred while retrieving incidents' });
  }
};

exports.submitIncident = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      upload(req, res, async (err) => {
        if (err) {
          console.error('Multer error:', err);
          return res.status(400).json({ error: 'Error uploading file' });
        }

        const { title, description, location } = req.body;
        let media = req.file ? req.file.path.replace('uploads\\', '') : null;

        if (!title || !description || !location) {
          return res.status(400).json({ error: 'Title, description, and location are required' });
        }

        try {
          if (media && (media.endsWith('.jfif') || media.endsWith('.webp'))) {
            const convertedImagePath = media.endsWith('.jfif') ? media.replace('.jfif', '.jpg') : media.replace('.webp', '.jpg');
            await sharp(req.file.path)
              .toFormat('jpeg')
              .toFile(`./uploads/${convertedImagePath}`);
            media = convertedImagePath;
          }
        

          const userId = decoded.userId; // Assuming userId is stored in the JWT token

          const query = 'INSERT INTO incidents (title, description, location, media, userId) VALUES (?, ?, ?, ?, ?)';
          pool.query(query, [title, description, location, media, userId], (error, results, fields) => {
            if (error) {
              console.error('Error saving incident:', error);
              return res.status(500).json({ error: 'An error occurred while saving the incident' });
            }
            res.status(201).json({ message: 'Incident reported successfully', incident: results });
          });
        } catch (error) {
          console.error('Error saving incident:', error);
          res.status(500).json({ error: 'An error occurred while saving the incident' });
        }
      });
    });
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(500).json({ error: 'An error occurred while verifying token' });
  }
};
  

exports.getrepaireReports = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      pool.query('SELECT * FROM repairreports', (error, results, fields) => {
        if (error) {
          console.error('Error retrieving repairreports:', error);
          return res.status(500).json({ error: 'An error occurred while retrieving repairreports' });
        }
        res.status(200).json(results);
      });
    });
  } catch (err) {
    console.error('Error retrieving repairreports:', err);
    res.status(500).json({ error: 'An error occurred while retrieving repairreports' });
  }
};

exports.submitRepairReport = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { description, duration } = req.body;
      const userId = decoded.userId;

      if (!description || !duration) {
        return res.status(400).json({ error: 'Description and duration are required' });
      }

      try {
        const query = 'INSERT INTO repairreports ( description, duration, userId) VALUES (?, ?, ?)';
        pool.query(query, [ description, duration, userId], (error, results, fields) => {
          if (error) {
            console.error('Error saving repairreports:', error);
            return res.status(500).json({ error: 'An error occurred while saving the repairreports' });
          }
          res.status(201).json({ message: 'repairreports reported successfully', RepairReport: results });
        });
      } catch (error) {
        console.error('Error saving repairreports:', error);
        res.status(500).json({ error: 'An error occurred while saving the repairreports' });
      }
    });
  }
   catch (err) {
    console.error('Error verifying token:', err);
    res.status(500).json({ error: 'An error occurred while verifying token' });
  }
};  


// Endpoint for area-based analytics
exports.getLocationAnalytics = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Construct SQL query to retrieve unique locations
      const locationQuery = `SELECT DISTINCT location FROM incidents`;

      // Execute query to get unique locations
      pool.query(locationQuery, (error, locationResults, fields) => {
        if (error) {
          console.error('Error retrieving location analytics:', error);
          return res.status(500).json({ error: 'An error occurred while retrieving location analytics' });
        }

        // Initialize array to store location analytics
        const locationAnalytics = [];

        // Construct SQL query to count total incidents
        const totalIncidentQuery = `SELECT COUNT(*) AS totalIncidentCount FROM incidents`;

        // Execute query to count total incidents
        pool.query(totalIncidentQuery, (totalIncidentError, totalIncidentResults, fields) => {
          if (totalIncidentError) {
            console.error('Error retrieving total incident count:', totalIncidentError);
            return res.status(500).json({ error: 'An error occurred while retrieving total incident count' });
          }

          const totalIncidentCount = totalIncidentResults[0].totalIncidentCount;

          // Iterate over each unique location
          locationResults.forEach(locationRow => {
            const location = locationRow.location;

            // Construct SQL query to count incidents for each location
            const incidentQuery = `SELECT COUNT(*) AS incidentCount FROM incidents WHERE location = ?`;

            // Execute query to count incidents for each location
            pool.query(incidentQuery, [location], (incidentError, incidentResults, fields) => {
              if (incidentError) {
                console.error('Error retrieving location analytics:', incidentError);
                return res.status(500).json({ error: 'An error occurred while retrieving location analytics' });
              }

              // Extract the count from the results
              const incidentCount = incidentResults[0].incidentCount;

              // Calculate the percentage of incidents in this location compared to total incidents
              const percentageOfTotal = (incidentCount / totalIncidentCount) * 100;

              // Construct the location analytics object
              const locationData = {
                location: location,
                incidentCount: incidentCount,
                percentageOfTotal: percentageOfTotal
              };

              // Push the location analytics to the array
              locationAnalytics.push(locationData);

              // Check if all location analytics are retrieved
              if (locationAnalytics.length === locationResults.length) {
                // Send the response with all location analytics
                res.status(200).json(locationAnalytics);
              }
            });
          });
        });
      });
    });
  } catch (err) {
    console.error('Error retrieving location analytics:', err);
    res.status(500).json({ error: 'An error occurred while retrieving location analytics' });
  }
};



// Endpoint for overall status analytics
exports.statusAnalytics = async (req, res) => {
  try {
    // Verify authentication token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Retrieve overall status analytics from the database
      pool.query('SELECT COUNT(*) AS total_incidents, SUM(CASE WHEN status = "resolved" THEN 1 ELSE 0 END) AS total_resolved, SUM(CASE WHEN status = "in_progress" THEN 1 ELSE 0 END) AS total_in_progress FROM Incidents', (error, results, fields) => {
        if (error) {
          console.error('Error retrieving overall status analytics:', error);
          return res.status(500).json({ error: 'An error occurred while retrieving overall status analytics' });
        }
        res.status(200).json(results[0]);
      });
    });
  } catch (err) {
    console.error('Error retrieving overall status analytics:', err);
    res.status(500).json({ error: 'An error occurred while retrieving overall status analytics' });
  }
};

// Endpoint for overall Reports analytics
exports.getLocationReportsAnalytics = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Construct SQL query to retrieve total reports for each location
      const locationReportsQuery = `
        SELECT 
          location,
          COUNT(*) AS locationReports,
          (SELECT COUNT(*) FROM incidents) AS totalReports
        FROM incidents
        GROUP BY location
      `;
      
      // Execute query to get total reports for each location
      pool.query(locationReportsQuery, (error, results, fields) => {
        if (error) {
          console.error('Error retrieving location reports analytics:', error);
          return res.status(500).json({ error: 'An error occurred while retrieving location reports analytics' });
        }

        // Send the response with location reports analytics
        res.status(200).json(results);
      });
    });
  } catch (err) {
    console.error('Error retrieving location reports analytics:', err);
    res.status(500).json({ error: 'An error occurred while retrieving location reports analytics' });
  }
};


// Endpoint to get an incident by ID
exports.getIncidentById = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const incidentId = req.params.id;
      const query = 'SELECT * FROM incidents WHERE id = ?';
      pool.query(query, [incidentId], (error, results, fields) => {
        if (error) {
          console.error('Error retrieving incident by ID:', error);
          return res.status(500).json({ error: 'An error occurred while retrieving incident by ID' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'Incident not found' });
        }
        res.status(200).json(results[0]);
      });
    });
  } catch (err) {
    console.error('Error retrieving incident by ID:', err);
    res.status(500).json({ error: 'An error occurred while retrieving incident by ID' });
  }
};