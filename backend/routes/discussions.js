const express = require('express');
const { body, validationResult } = require('express-validator');
const Discussion = require('../models/Discussion');
const Message = require('../models/Message');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/discussions
// @desc    Get all discussions for user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { projectId, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};

    if (projectId) {
      // Check if user has access to project
      const project = await Project.findById(projectId);
      if (!project || !project.isMember(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to project'
        });
      }
      query.projectId = projectId;
    } else {
      // Get discussions from projects user has access to
      const userProjects = await Project.find({
        $or: [
          { createdBy: req.user._id },
          { 'members.user': req.user._id }
        ]
      }).select('_id');
      
      query.projectId = { $in: userProjects.map(p => p._id) };
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const discussions = await Discussion.find(query)
      .populate('projectId', 'name color')
      .populate('createdBy', 'name email avatar')
      .populate('participants', 'name email avatar')
      .sort({ isPinned: -1, lastMessageAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Discussion.countDocuments(query);

    res.json({
      success: true,
      data: {
        discussions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussions'
    });
  }
});

// @route   GET /api/discussions/:id
// @desc    Get single discussion with messages
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('projectId', 'name color')
      .populate('createdBy', 'name email avatar')
      .populate('participants', 'name email avatar');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if user has access to project
    const project = await Project.findById(discussion.projectId._id);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get messages
    const messages = await Message.find({ discussionId: discussion._id })
      .populate('author', 'name email avatar')
      .populate('mentions', 'name email avatar')
      .sort({ createdAt: 1 });

    // Add user as participant if not already
    if (!discussion.participants.includes(req.user._id)) {
      await discussion.addParticipant(req.user._id);
    }

    res.json({
      success: true,
      data: { 
        discussion,
        messages
      }
    });

  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussion'
    });
  }
});

// @route   POST /api/discussions
// @desc    Create new discussion
// @access  Private
router.post('/', authenticateToken, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Discussion title is required and cannot exceed 200 characters'),
  body('projectId')
    .isMongoId()
    .withMessage('Valid project ID is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, projectId, tags } = req.body;

    // Check if user has access to project
    const project = await Project.findById(projectId);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to project'
      });
    }

    const discussion = new Discussion({
      title,
      projectId,
      createdBy: req.user._id,
      participants: [req.user._id],
      tags: tags || []
    });

    await discussion.save();

    // Populate the discussion
    await discussion.populate('projectId', 'name color');
    await discussion.populate('createdBy', 'name email avatar');
    await discussion.populate('participants', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: { discussion }
    });

  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create discussion'
    });
  }
});

// @route   POST /api/discussions/:id/messages
// @desc    Add message to discussion
// @access  Private
router.post('/:id/messages', authenticateToken, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content is required and cannot exceed 2000 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if user has access to project
    const project = await Project.findById(discussion.projectId);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { content, parentId, mentions } = req.body;

    const message = new Message({
      content,
      author: req.user._id,
      discussionId: discussion._id,
      parentId: parentId || null,
      mentions: mentions || []
    });

    await message.save();

    // Update discussion
    await discussion.updateLastMessage();
    await discussion.addParticipant(req.user._id);

    // Populate the message
    await message.populate('author', 'name email avatar');
    await message.populate('mentions', 'name email avatar');

    // Create notifications for mentioned users
    if (mentions && mentions.length > 0) {
      for (const mentionId of mentions) {
        if (mentionId !== req.user._id.toString()) {
          await Notification.createNotification({
            type: 'discussion_mention',
            title: 'Mentioned in Discussion',
            message: `${req.user.name} mentioned you in discussion "${discussion.title}"`,
            userId: mentionId,
            priority: 'medium',
            actionUrl: `/discussions/${discussion._id}`,
            relatedEntity: { type: 'discussion', id: discussion._id }
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// @route   PUT /api/discussions/:id/pin
// @desc    Pin/unpin discussion
// @access  Private
router.put('/:id/pin', authenticateToken, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if user has access to project
    const project = await Project.findById(discussion.projectId);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only project admins can pin discussions
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only project admins can pin discussions'
      });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.json({
      success: true,
      message: `Discussion ${discussion.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: { discussion }
    });

  } catch (error) {
    console.error('Pin discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update discussion'
    });
  }
});

module.exports = router;
