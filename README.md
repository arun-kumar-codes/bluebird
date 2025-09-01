# Bulebird - Full Stack Application

A comprehensive full-stack application demonstrating JWT authentication, Role-Based Access Control (RBAC), and organization-scoped data sharing built with FastAPI, MySQL, React, and TanStack Query.

## 🏗️ Architecture

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **MySQL** - Relational database with PyMySQL driver
- **SQLAlchemy** - SQL toolkit and ORM
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin and Member roles with different permissions

### Frontend
- **React 18** with TypeScript
- **TanStack Query** - Powerful data synchronization for React
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### Database Schema
- **Users** - User accounts with roles (Admin/Member)
- **Organizations** - Multi-tenant organization structure
- **Notes** - Shared notes within organizations
- **Todos** - Shared todo items within organizations

## 🚀 Features

### Authentication & Authorization
- ✅ User signup and login with JWT tokens
- ✅ Role-based access control (ADMIN, MEMBER)
- ✅ Organization-scoped data access
- ✅ Secure password hashing with bcrypt

### Multi-tenancy
- ✅ Users belong to organizations
- ✅ Data is scoped to organizations
- ✅ Members can only access their organization's data

### CRUD Operations
- ✅ Create, read, update, delete Notes
- ✅ Create, read, update, delete Todos
- ✅ Role-based permissions (Admin can delete, Members can create/edit own items)

### Frontend Features
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time data synchronization with TanStack Query
- ✅ Protected routes and authentication state management
- ✅ Role-based UI restrictions
- ✅ Error handling and loading states

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.0+ (running locally)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create test data:**
   ```bash
   python create_test_data.py
   ```

5. **Start the backend server:**
   ```bash
   python start_server.py
   ```

   The backend will be available at: http://localhost:8080

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will be available at: http://localhost:3000

## 🧪 Testing

The application includes comprehensive functionality testing through the web interface.

### Test Accounts

The application comes with pre-created test accounts:

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: Admin (can delete notes/todos)

**Member User:**
- Username: `john_doe`
- Password: `member123`
- Role: Member (can create/edit own items)

## 📁 Project Structure

```
Bulebird/
├── backend/
│   ├── app/
│   │   ├── api/          # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── notes.py
│   │   │   ├── organizations.py
│   │   │   └── todos.py
│   │   ├── core/         # Core functionality
│   │   │   ├── auth.py
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── crud/         # Database operations
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   ├── config.env        # Environment configuration template
│   ├── create_test_data.py
│   ├── requirements.txt
│   └── start_server.py
├── frontend/
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── hooks/        # Custom hooks (TanStack Query)
│   │   └── types/        # TypeScript type definitions
│   ├── config.env        # Environment configuration template
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login and get access token
- `GET /auth/me` - Get current user information

### Organizations
- `GET /organizations/` - List organizations (Admin only)
- `POST /organizations/` - Create organization (Admin only)
- `GET /organizations/{id}` - Get organization details

### Notes
- `GET /notes/` - Get notes for user's organization
- `POST /notes/` - Create new note
- `GET /notes/{id}` - Get specific note
- `PUT /notes/{id}` - Update note (creator or admin)
- `DELETE /notes/{id}` - Delete note (admin only)

### Todos
- `GET /todos/` - Get todos for user's organization
- `POST /todos/` - Create new todo
- `GET /todos/{id}` - Get specific todo
- `PUT /todos/{id}` - Update todo (creator or admin)
- `DELETE /todos/{id}` - Delete todo (admin only)

## 🔒 Security Features

- **JWT Token Authentication** - Secure stateless authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Role-Based Access Control** - Different permissions for Admin/Member roles
- **Organization Isolation** - Users can only access their organization's data
- **CORS Protection** - Configured for frontend origin
- **Input Validation** - Pydantic schemas for request/response validation

## 🚀 Deployment Considerations

### Production Configuration
- Update `SECRET_KEY` in environment variables
- Use strong database credentials
- Enable HTTPS/SSL
- Configure proper CORS origins
- Set up database connection pooling
- Implement rate limiting
- Add logging and monitoring

### Environment Configuration
The application uses configuration files for environment setup:

**Backend (`backend/config.env`):**
```env
DATABASE_URL=mysql+pymysql://root:Java_123@localhost/threatnoteDB
SECRET_KEY=bulebird-super-secret-key-change-in-production-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8080
```

**Frontend (`frontend/config.env`):**
```env
REACT_APP_API_URL=http://localhost:8080
```

Copy these files to `.env` to customize your local setup.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♀️ Support

For questions or issues, please create an issue in the GitHub repository.
