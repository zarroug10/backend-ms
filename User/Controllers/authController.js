const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Team = require('../Models/Team');
const { Sequelize, Op } = require('sequelize');


//listing the users api

exports.getUsers = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const users = await User.findAll();
      res.status(200).json(users);
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'An error occurred while retrieving users' });
  }
};

//get Clients
exports.getClientUsers = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    const clientUsers = await User.findAll({ where: { userType: 'client' } });
    res.status(200).json(clientUsers);
  });
  } catch (error) {
    console.error('Error retrieving client users:', error);
    res.status(500).json({ error: 'An error occurred while retrieving client users' });
  }
};

// Listing the technician users
exports.getTechnicianUsers = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    const technicianUsers = await User.findAll({ where: { userType: 'technician' } });
    res.status(200).json(technicianUsers);
    });
  } catch (error) {
    console.error('Error retrieving technician users:', error);
    res.status(500).json({ error: 'An error occurred while retrieving technician users' });
  }
};

// Listing the chief users
exports.getChiefUsers = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    const chiefUsers = await User.findAll({ where: { userType: 'chief' } });
    res.status(200).json(chiefUsers);
    });
  } catch (error) {
    console.error('Error retrieving chief users:', error);
    res.status(500).json({ error: 'An error occurred while retrieving chief users' });
  }
};

//sign up api
exports.signup = async (req, res) => {
  try {
    const { username, email, password, location, userType, tel, cin } = req.body;

    // Check if user with the same email or telephone number exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const existingTelUser = await User.findOne({ where: { tel } });
    if (existingTelUser) {
      return res.status(400).json({ error: 'User with this telephone number already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      location,
      userType,
      tel,
      cin
    });

    res.status(201).json({ message: 'User signed up successfully', user: newUser });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'An error occurred while signing up user' });
  }
};

// login api
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token with user's role included
    const token = jwt.sign({ userId: user.id, userType: user.userType }, 'your_secret_key_here');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'An error occurred while logging in user' });
  }
};

//search api
exports.findUser = async (req, res) => {
  try {
    const { username, tel, location, userType } = req.query;
    const searchParams = {};

    if (username) {
      searchParams.username = { [Sequelize.Op.like]: `%${username}%` };
    }
    if (tel) {
      searchParams.tel = { [Sequelize.Op.like]: `%${tel}%` };
    }
    if (location) {
      searchParams.location = { [Sequelize.Op.like]: `%${location}%` };
    }
    if (userType) {
      searchParams.userType = { [Sequelize.Op.like]: `%${userType}%` };
    }
    const searchResults = await User.findAll({ where: searchParams });

    if (searchResults.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

//form a team
exports.formTeam = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { teamName } = req.body;
      let { technicianIds } = req.body;

      if (!teamName || !technicianIds || !Array.isArray(technicianIds)) {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      // Retrieve only users with the role "technician"
      const technicians = await User.findAll({
        where: { id: technicianIds, userType: 'technician' }
      });

      if (technicians.length !== technicianIds.length) {
        // Some of the provided IDs are not technicians
        return res.status(400).json({ error: 'Invalid technician IDs provided' });
      }

      // Create a new team with the provided name
      const team = await Team.create({ name: teamName });

      // Update the teamId of each technician with the ID of the newly created team
      await Promise.all(technicians.map(async (technician) => {
        await technician.update({ teamId: team.id });
      }));

      res.status(200).json({ message: 'Team formed successfully' });
    });
  } catch (error) {
    console.error('Error forming team:', error);
    res.status(500).json({ error: 'An error occurred while forming team' });
  }
}; 

//Display teams
exports.displayTeams = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Fetch all teams
      const teams = await Team.findAll();

      // Map over teams and retrieve members for each team
      const teamsWithMembers = await Promise.all(teams.map(async (team) => {
        const teamMembers = await User.findAll({
          where: { teamId: team.id }
        });
        return {
          id: team.id,
          name: team.name,
          members: teamMembers.map(member => ({ id: member.id, name: member.name }))
        };
      }));

      res.status(200).json({ teams: teamsWithMembers });
    });
  } catch (error) {
    console.error('Error displaying teams:', error);
    res.status(500).json({ error: 'An error occurred while displaying teams' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    const { id } = req.params;
    const { username, email, location, tel, cin } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username;
    user.email = email;
    user.location = location;
    user.tel = tel;
    user.cin = cin;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating user' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    const { id } = req.params;

    // Find user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy(); // Delete user from the database

    res.status(200).json({ message: 'User deleted successfully' });
  });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting user' });
  }
};

//search techniciens
exports.searchTechs = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    const { query, username, location, tel, cin } = req.query;

    let searchParams = {
      userType: 'technician' // Only fetch technicians
    };

    if (query || username || tel || cin) {
      const usernameSearch = { [Op.like]: `%${query || username || tel || cin}%` };
      const cinSearch = { [Op.like]: `%${query || username || tel || cin}%` };
      searchParams[Op.or] = [
        { username: usernameSearch },
        { cin: cinSearch },
        { tel: { [Op.like]: `%${query || username || tel || cin}%` } }
      ];
    }
    if (location) {
      searchParams.location = { [Op.like]: `%${location}%` };
    }

    const searchResults = await User.findAll({ where: searchParams });

    if (searchResults.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json(searchResults);
  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// Get user By id 
exports.getUserById = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid token' });
        } else {
          return res.status(500).json({ error: 'An error occurred while verifying token' });
        }
      }

      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Set the user in the request object
      req.user = user;

      // Send the user back in the response
      res.status(200).json(user);
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching user by ID' });
  }
};


