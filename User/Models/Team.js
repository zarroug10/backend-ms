const { Sequelize, DataTypes } = require('sequelize');

// Initialize database connection details
const sequelize = new Sequelize('water company', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync the Team model with the database
sequelize.sync().then(() => {
  console.log('Team model synced with database');
}).catch(err => {
  console.error('Error syncing Team model:', err);
});

module.exports = Team;