# SlotSwapper

A full-stack web application for managing time slots and swapping shifts between users. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## 🌐 Live Demo

- **Frontend**: [https://slot-swapper-fxdb.vercel.app](https://slot-swapper-fxdb.vercel.app)
- **Backend API**: [https://slot-swapper-backend.vercel.app](https://slot-swapper-backend.vercel.app)

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Event Management**: Create, update, and delete time slots
- **Slot Status**: Mark slots as BUSY, SWAPPABLE, or SWAP_PENDING
- **Marketplace**: Browse and request swaps with other users
- **Request Management**: View and respond to incoming/outgoing swap requests
- **Transaction Safety**: Database transactions ensure data consistency during swaps
- **Mobile Responsive**: Optimized for mobile devices

## Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **TailwindCSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## Project Structure

```
slot-swapper/
├── backend/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Event.js          # Event/Slot model
│   │   └── SwapRequest.js    # Swap request model
│   └── routes/
│       ├── auth.js           # Authentication routes (signup/login)
│       ├── events.js         # Event CRUD operations
│       └── swaps.js          # Swap marketplace and requests
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js        # Axios client configuration
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── App.jsx           # Main app router
│   │   └── main.jsx          # Entry point
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/slot-swapper
JWT_SECRET=your-secret-key-here-change-in-production
```

4. Start the backend server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_BASE=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port)

## Application Flow

### 1. Authentication Flow

**Signup**
1. User submits name, email, and password via `/signup` page
2. Frontend sends POST to `/api/auth/signup`
3. Backend:
   - Validates input
   - Checks if email already exists
   - Hashes password using bcrypt
   - Creates new User document
   - Generates JWT token
   - Returns token and user data
4. Frontend stores token in localStorage and redirects to Dashboard

**Login**
1. User submits email and password via `/login` page
2. Frontend sends POST to `/api/auth/login`
3. Backend:
   - Finds user by email
   - Verifies password using bcrypt
   - Generates JWT token
   - Returns token and user data
4. Frontend stores token in localStorage and redirects to Dashboard

**Authentication Middleware**
- For protected routes, frontend includes `Authorization: Bearer <token>` header
- Backend auth middleware validates token and attaches user to `req.user`

### 2. Event Management Flow

**Dashboard Page** (`/dashboard`)
1. User views all their events sorted by start time
2. Can create new events with title, start time, and end time
3. Each event has status: BUSY, SWAPPABLE, or SWAP_PENDING

**Event Status Transitions**
- **BUSY** (default): Event exists but not available for swapping
- **SWAPPABLE**: User wants to swap this event with another user
- **SWAP_PENDING**: A swap request has been made and is awaiting response

**Operations**
- **Create**: `POST /api/events` - Creates new event with default BUSY status
- **Read**: `GET /api/events` - Returns all events owned by authenticated user
- **Update**: `PUT /api/events/:id` - Updates event details or status
- **Delete**: `DELETE /api/events/:id` - Removes event (must be owner)

### 3. Swap Marketplace Flow

**Marketplace Page** (`/marketplace`)
1. User can view all swappable slots from other users
2. Selects a target slot they want to swap for
3. Selects one of their own SWAPPABLE slots as an offer
4. Submits swap request

**Create Swap Request**
1. Frontend sends `POST /api/swaps/swap-request` with `{ mySlotId, theirSlotId }`
2. Backend transaction:
   - Verifies both slots exist and are SWAPPABLE
   - Verifies user owns mySlot
   - Creates SwapRequest document (status: PENDING)
   - Sets both slots to SWAP_PENDING status
   - Commits transaction
3. Frontend refreshes marketplace to show updated slot statuses

### 4. Swap Request Management Flow

**Requests Page** (`/requests`)
- **Incoming Requests**: Swap requests sent to the authenticated user
  - Shows who wants to swap
  - Displays their slot and offered slot details
  - PENDING: Shows Accept/Reject buttons
  - ACCEPTED/REJECTED: Shows status badge

- **Outgoing Requests**: Swap requests sent by the authenticated user
  - Shows who received the request
  - Displays slot details
  - Always shows status badge (PENDING, ACCEPTED, or REJECTED)

**Respond to Request**
1. User clicks Accept or Reject button on incoming request
2. Frontend sends `POST /api/swaps/swap-response/:id` with `{ accepted: true/false }`
3. Backend transaction:
   - Verifies request exists and user is authorized (toUser)
   - Verifies request is still PENDING
   - If accepted:
     - Swaps the owner fields between the two events
     - Sets both events status to BUSY
     - Sets SwapRequest status to ACCEPTED
   - If rejected:
     - Sets both events status back to SWAPPABLE
     - Sets SwapRequest status to REJECTED
   - Commits transaction
4. Frontend refreshes requests page to show updated status

### 5. Data Models

**User**
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  timestamps
}
```

**Event**
```javascript
{
  title: String,
  startTime: Date,
  endTime: Date,
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING',
  owner: ObjectId (ref: User),
  timestamps
}
```

**SwapRequest**
```javascript
{
  fromUser: ObjectId (ref: User),      // Requester
  toUser: ObjectId (ref: User),        // Owner of theirSlot
  mySlot: ObjectId (ref: Event),       // Offered slot
  theirSlot: ObjectId (ref: Event),    // Requested slot
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  timestamps
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Swaps
- `GET /api/swaps/swappable-slots` - Get all swappable slots from other users
- `POST /api/swaps/swap-request` - Create swap request
- `POST /api/swaps/swap-response/:id` - Accept/reject swap request
- `GET /api/swaps/requests` - Get incoming/outgoing requests

All endpoints except `/api/auth/*` require authentication via JWT token.

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Authorization Checks**: Users can only modify their own resources
4. **Transaction Safety**: MongoDB sessions ensure atomic operations
5. **Input Validation**: Backend validates all user inputs

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Backend
```bash
cd backend
npm start
```

## Future Enhancements

- Email notifications for swap requests
- Calendar integration
- Advanced filtering and search
- User profiles and preferences
- Swap history and analytics
- Mobile app version

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

