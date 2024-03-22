const { Sequelize, DataTypes } = require('sequelize');
const Team = require('../Models/Team'); // Correct the import statement

// Initialize database connection details
const sequelize = new Sequelize('water company', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userType: {
    type: DataTypes.ENUM('client', 'technician', 'chief', 'Admin'),
    defaultValue: 'client'
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: {
        args: /^\d{8}$/,
        msg: 'The telephone number must be 8 digits.'
      }
    }
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: {
        args: /^\d{8}$/,
        msg: 'The CIN must be 8 digits.'
      }
    }
  }
});

// Define the association after defining the Team model
User.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team' // Adjust the alias if needed
});

// Sync the User model with the database
User.sync().then(() => {
  console.log('User model synced with database');
}).catch(err => {
  console.error('Error syncing User model:', err);
});

module.exports = User;
