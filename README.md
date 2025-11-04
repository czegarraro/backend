# Dynatrace Problems API - Backend

Backend API for the Dynatrace Problems Dashboard application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ LTS
- MongoDB Atlas account (connection string provided)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# The .env file is already configured with MongoDB Atlas credentials
# No changes needed unless you want to customize settings

# Start development server
npm run dev
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB connection
│   │   └── env.ts       # Environment validation
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── problem.controller.ts
│   │   └── analytics.controller.ts
│   ├── middlewares/     # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── repositories/    # Data access layer
│   │   └── problem.repository.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── problem.service.ts
│   │   └── analytics.service.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── problem.routes.ts
│   │   ├── analytics.routes.ts
│   │   ├── filter.routes.ts
│   │   └── index.ts
│   ├── types/           # TypeScript types
│   │   ├── problem.types.ts
│   │   └── api.types.ts
│   ├── utils/           # Utility functions
│   │   ├── jwt.utils.ts
│   │   ├── date.utils.ts
│   │   └── response.utils.ts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login with credentials
- `POST /api/v1/auth/logout` - Logout (requires auth)
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Problems

- `GET /api/v1/problems` - Get all problems with filters
- `GET /api/v1/problems/:problemId` - Get problem by ID
- `PATCH /api/v1/problems/:problemId/status` - Update problem status
- `POST /api/v1/problems/:problemId/comments` - Add comment

### Analytics

- `GET /api/v1/analytics/kpis` - Get dashboard KPIs
- `GET /api/v1/analytics/time-series` - Get time series data
- `GET /api/v1/analytics/impact-severity-matrix` - Get impact vs severity matrix
- `GET /api/v1/analytics/top-entities` - Get top affected entities
- `GET /api/v1/analytics/management-zones` - Get management zones analysis
- `GET /api/v1/analytics/remediation-funnel` - Get remediation funnel
- `GET /api/v1/analytics/duration-distribution` - Get duration distribution
- `GET /api/v1/analytics/evidence-types` - Get evidence types breakdown

### Filters

- `GET /api/v1/filters/options` - Get available filter options

### Health

- `GET /api/v1/health` - Health check endpoint

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Demo Credentials:**
- Username: `czegarra`
- Password: `czegarra`

Tokens are stored in httpOnly cookies and expire after 30 minutes of inactivity.

## 🗄️ Database

**MongoDB Atlas Configuration:**
- Database: `problemas-dynatrace-uno`
- Collection: `problems`
- Connection string is pre-configured in `.env.example`

The application automatically creates optimized indexes on startup:
- Compound index: `{ impactLevel, severityLevel, status }`
- Time index: `{ startTime: -1 }`
- Management zones: `{ "managementZones.name": 1 }`
- Text search: `{ title, displayId, comments }`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Testing
npm test             # Run tests
npm run test:coverage # Run tests with coverage
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript (strict mode)
- **Database:** MongoDB (via official driver)
- **Authentication:** JWT + bcryptjs
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Morgan
- **Testing:** Vitest

## 🔒 Security Features

- Helmet.js security headers
- CORS configuration
- Rate limiting (100 req/min)
- JWT authentication
- Input validation with Zod
- httpOnly cookies
- Request size limits

## 🚦 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=problemas-dynatrace-uno
MONGODB_COLLECTION_NAME=problems

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=30m

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "statusCode": 400
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

## 📝 Development Notes

- All routes (except auth) require authentication
- Pagination defaults: page=1, limit=10
- Sorting defaults: sortBy=startTime, sortOrder=desc
- Duration is calculated in minutes
- GitHub Actions detection is case-insensitive

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use ESLint configuration
3. Write tests for new features
4. Follow the Repository Pattern
5. Document complex functions with JSDoc

## 📄 License

MIT
