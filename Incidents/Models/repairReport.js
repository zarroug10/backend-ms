const mysql = require('mysql');

const RepairReport = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'water company'
});

const RepairReportSchema = `
  CREATE TABLE IF NOT EXISTS RepairReports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    duration INT NOT NULL,
    userId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;

RepairReport.query(RepairReportSchema, (error, results, fields) => {
  if (error) {
    console.error('Error creating RepairReport table: ' + error.stack);
    return;
  }
});

module.exports = RepairReport;
