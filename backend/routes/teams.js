const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/teams
// @desc    Get team statistics and members
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, role, status } = req.query;
    
    // Build query for team members
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const teamMembers = await User.find(query)
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 });

    // Get team statistics
    const totalMembers = await User.countDocuments();
    const activeMembers = await User.countDocuments({ status: 'active' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const departments = await User.distinct('department');

    // Get projects count
    const totalProjects = await Project.countDocuments();

    res.json({
      success: true,
      data: {
        members: teamMembers,
        stats: {
          totalMembers,
          activeMembers,
          adminCount,
          totalProjects,
          departments: departments.length
        }
      }
    });

  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team data'
    });
  }
});

module.exports = router;
