const mysql = require('mysql');

const FeedBack = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'water company'  
});

const FeedBackSchema = `
CREATE TABLE IF NOT EXISTS Feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    message TEXT NOT NULL,
    incidentId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (incidentId) REFERENCES incidents(id) ON DELETE CASCADE
);
`;

FeedBack.query(FeedBackSchema, (error, results, fields) => {
  if (error) {
    console.error('Error creating FeedBack table: ' + error.stack);
    return;
  }
});

module.exports = FeedBack;
