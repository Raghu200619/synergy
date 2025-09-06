# SynergySphere Backend API

A comprehensive Node.js/Express backend API for the SynergySphere Team Collaboration Platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Project Management**: Create, update, delete, and manage projects
- **Task Management**: Full CRUD operations for tasks with comments and attachments
- **Team Management**: User management with roles and permissions
- **Discussions**: Real-time discussion threads with messages and reactions
- **Notifications**: Comprehensive notification system with different types
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd synergysphere-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/synergysphere
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas (cloud)

5. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/:id/status` - Update user status

### Teams
- `GET /api/teams` - Get team statistics and members

### Discussions
- `GET /api/discussions` - Get all discussions
- `GET /api/discussions/:id` - Get single discussion
- `POST /api/discussions` - Create new discussion
- `POST /api/discussions/:id/messages` - Add message to discussion
- `PUT /api/discussions/:id/pin` - Pin/unpin discussion

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/:id/unread` - Mark as unread
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/clear-all` - Clear all notifications

## 🗄️ Database Models

### User
- Personal information (name, email, avatar)
- Authentication (password, refresh tokens)
- Role and permissions (admin, member, viewer)
- Status tracking (active, away, offline)

### Project
- Project details (name, description, status, progress)
- Member management with roles
- Settings and configuration
- Timeline (start/end dates)

### Task
- Task information (title, description, status, priority)
- Assignment and tracking
- Comments and attachments
- Subtasks and dependencies

### Discussion
- Discussion threads per project
- Participant management
- Pinning and locking

### Message
- Messages within discussions
- Reactions and mentions
- Attachments support

### Notification
- Different notification types
- Priority levels
- Read/unread status
- Auto-expiration

### Comment
- Comments on tasks
- Nested replies
- Reactions and attachments

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get access and refresh tokens
2. **Include token** in Authorization header: `Bearer <token>`
3. **Refresh tokens** when access token expires
4. **Role-based access** for different endpoints

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Express-validator
- **Password Hashing**: bcryptjs
- **JWT Security**: Secure token handling

## 📝 Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/synergysphere |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "synergysphere-api"
pm2 startup
pm2 save
```

### Using Docker
```bash
docker build -t synergysphere-backend .
docker run -p 5000:5000 synergysphere-backend
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or production MongoDB
3. Set secure JWT secret
4. Configure CORS for production frontend URL
5. Set up SSL/HTTPS

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## 🔄 Real-time Features

The API is designed to work with Socket.IO for real-time features:
- Live notifications
- Real-time discussions
- Activity updates
- Status changes

## 📈 Performance

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: All list endpoints support pagination
- **Caching**: Ready for Redis integration
- **Compression**: Gzip compression enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

---

**SynergySphere Backend API** - Powering team collaboration with modern technology! 🚀
