const FeedBack = require('../Model/feedBack')
const jwt = require('jsonwebtoken');




exports.getFeedBack = async (req, res) => { 
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const query = `
                SELECT f.*, u.username, i.title AS incidentTitle 
                FROM FeedBacks f 
                INNER JOIN Users u ON f.userId = u.id 
                INNER JOIN incidents i ON f.incidentId = i.id
            `;
            FeedBack.query(query, (error, results, fields) => {
                if (error) {
                    console.error('Error retrieving feedbacks:', error);
                    return res.status(500).json({ error: 'An error occurred while retrieving feedbacks' });
                }
                res.status(200).json(results);
            });
        });
    } catch (err) {
        console.error('Error retrieving feedbacks:', err);
        res.status(500).json({ error: 'An error occurred while retrieving feedbacks' });
    }
};

  
  
  exports.submitFeedBack = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const { message, incidentId } = req.body;
            const userId = decoded.userId;

            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            try {
                const query = `
                    INSERT INTO FeedBacks (message, userId, incidentId) 
                    VALUES (?, ?, ?);
                `;
                FeedBack.query(query, [message, userId, incidentId], (error, results, fields) => {
                    if (error) {
                        console.error('Error saving feedback:', error);
                        return res.status(500).json({ error: 'An error occurred while saving the feedback' });
                    }
                    // Fetch incident title corresponding to the incidentId
                    const incidentTitleQuery = `
                        SELECT title FROM incidents WHERE id = ?;
                    `;
                    FeedBack.query(incidentTitleQuery, [incidentId], (incidentError, incidentResults, incidentFields) => {
                        if (incidentError) {
                            console.error('Error fetching incident title:', incidentError);
                            return res.status(500).json({ error: 'An error occurred while fetching incident title' });
                        }
                        const title = incidentResults[0] ? incidentResults[0].title : null;
                        res.status(201).json({ message: 'Feedback sent successfully', incidentId, title });
                    });
                });
            } catch (error) {
                console.error('Error saving feedback:', error);
                res.status(500).json({ error: 'An error occurred while saving the feedback' });
            }
        });
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(500).json({ error: 'An error occurred while verifying token' });
    }
};
