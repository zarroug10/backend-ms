const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Team = require('../Models/Team');
const { Sequelize, Op ,  QueryTypes} = require('sequelize');


//Assign 
exports.assignIncidentToTeam = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { teamId, incidentId } = req.body;

      if (!teamId || !incidentId) {
        return res.status(400).json({ error: 'Both teamId and incidentId are required' });
      }

      // Check if the team exists
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Update the incident with the provided teamId
      await User.update({ teamId }, {
        where: {
          id: incidentId,
          userType: { [Op.not]: 'technician' } // Assuming incidents are not technicians
        }
      });

      res.status(200).json({ message: 'Incident assigned to team successfully' });
    });
  } catch (error) {
    console.error('Error assigning incident to team:', error);
    res.status(500).json({ error: 'An error occurred while assigning incident to team' });
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
      const token = req.headers.authorization; // Extract the token from the request headers
  
      // Verify the token
      jwt.verify(token, 'your_secret_key_here', async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid token' });
        }
  
        // Construct the raw SQL query
        const query = `
          SELECT teams.name AS teamName, users.username, users.email, incidents.id AS incidentId
          FROM teams
          INNER JOIN users ON teams.id = users.teamId
          LEFT JOIN incidents ON incidents.userId = users.id
        `;
  
        // Execute the raw SQL query using the User model's Sequelize instance
        const teamsWithMembers = await User.sequelize.query(query, { type: QueryTypes.SELECT });
  
        // Format the response data
        const formattedTeams = {};
  
        teamsWithMembers.forEach(row => {
          const { teamName, username, email, incidentId } = row;
          if (!formattedTeams[teamName]) {
            formattedTeams[teamName] = { name: teamName, members: [] };
          }
          formattedTeams[teamName].members.push({ username, email, incidentId });
        });
  
        // Send the formatted data as response
        res.status(200).json({ teams: Object.values(formattedTeams) });
      });
    } catch (error) {
      console.error('Error fetching teams with members:', error);
      res.status(500).json({ error: 'An error occurred while fetching teams with members' });
    }
  };

// Get Team by ID
exports.getTeamById = async (req, res) => {
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
          const team = await Team.findByPk(id);
    
          if (!team) {
            return res.status(404).json({ error: 'team not found' });
          }
    
          // Set the user in the request object
          req.team = team;
    
          // Send the user back in the response
          res.status(200).json(team);
        });
      } catch (error) {
        console.error('Error fetching team by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching team by ID' });
      }
    };