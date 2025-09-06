const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { projectId, status, assignedTo, priority, page = 1, limit = 10 } = req.query;
    
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
      // Get tasks from projects user has access to
      const userProjects = await Project.find({
        $or: [
          { createdBy: req.user._id },
          { 'members.user': req.user._id }
        ]
      }).select('_id');
      
      query.projectId = { $in: userProjects.map(p => p._id) };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('watchers', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to project
    const project = await Project.findById(task.projectId._id);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get comments
    const comments = await Comment.find({ taskId: task._id })
      .populate('author', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: { 
        task,
        comments
      }
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', authenticateToken, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title is required and cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('projectId')
    .isMongoId()
    .withMessage('Valid project ID is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Valid due date is required')
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

    const { title, description, projectId, assignedTo, priority, dueDate, tags, estimatedHours } = req.body;

    // Check if user has access to project
    const project = await Project.findById(projectId);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to project'
      });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      createdBy: req.user._id,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tags || [],
      estimatedHours
    });

    await task.save();

    // Populate the task
    await task.populate('projectId', 'name color');
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Create notification if task is assigned to someone
    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await Notification.createNotification({
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to task "${title}" in project "${project.name}"`,
        userId: assignedTo,
        priority: priority === 'urgent' || priority === 'high' ? 'high' : 'medium',
        actionUrl: `/tasks/${task._id}`,
        relatedEntity: { type: 'task', id: task._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authenticateToken, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority')
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

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to project
    const project = await Project.findById(task.projectId);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, status, priority, assignedTo, dueDate, tags, estimatedHours, actualHours } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (tags) updateData.tags = tags;
    if (estimatedHours) updateData.estimatedHours = estimatedHours;
    if (actualHours) updateData.actualHours = actualHours;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('projectId', 'name color')
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');

    // Create notification for status change
    if (status && status === 'completed' && task.assignedTo) {
      await Notification.createNotification({
        type: 'task_completed',
        title: 'Task Completed',
        message: `Task "${updatedTask.title}" has been completed`,
        userId: task.assignedTo,
        priority: 'medium',
        actionUrl: `/tasks/${updatedTask._id}`,
        relatedEntity: { type: 'task', id: updatedTask._id }
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to project
    const project = await Project.findById(task.projectId);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only creator or project admin can delete task
    if (task.createdBy.toString() !== req.user._id.toString() && !project.isAdmin(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // Delete related comments
    await Comment.deleteMany({ taskId: req.params.id });

    // Delete task
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add comment to task
// @access  Private
router.post('/:id/comments', authenticateToken, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment content is required and cannot exceed 1000 characters')
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

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to project
    const project = await Project.findById(task.projectId);
    if (!project || !project.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { content, parentId } = req.body;

    const comment = new Comment({
      content,
      author: req.user._id,
      taskId: task._id,
      parentId: parentId || null
    });

    await comment.save();
    await comment.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

module.exports = router;
