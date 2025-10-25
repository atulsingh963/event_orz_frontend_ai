# Event Organizer Platform - Frontend

React + Vite frontend application for the Event Organizer Platform.

## Features

- Role-based authentication and routing
- Event Organizer dashboard with event creation
- Event Manager dashboard with talent recruitment
- Talent dashboard with invitation management
- Rating and review system
- Responsive design
- Modern UI/UX

## Tech Stack

- React 18
- Vite
- React Router v6
- Axios for API calls
- Context API for state management

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on `http://localhost:3000`

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
│   ├── organizer/   # Event Organizer pages
│   ├── manager/     # Event Manager pages
│   └── talent/      # Talent pages
├── context/         # React Context providers
├── services/        # API service functions
├── utils/           # Utility functions
├── App.jsx          # Main app component
├── App.css          # Global styles
└── main.jsx         # Entry point
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Event Organizer Routes (Protected)
- `/organizer/dashboard` - Organizer dashboard
- `/organizer/create-event` - Create new event

### Event Manager Routes (Protected)
- `/manager/dashboard` - Manager dashboard
- `/manager/events/:eventId/talents` - Manage event talents

### Talent Routes (Protected)
- `/talent/dashboard` - Talent dashboard with invitations

## Environment Variables

The frontend uses Vite's proxy configuration to connect to the backend API at `http://localhost:5000`. No additional environment variables are needed for development.

## API Integration

All API calls are centralized in the `services/` directory:
- `authService.js` - Authentication APIs
- `eventService.js` - Event management APIs
- `invitationService.js` - Invitation and talent APIs
- `ratingService.js` - Rating APIs
- `venueService.js` - Venue APIs

## Authentication

The app uses JWT tokens stored in localStorage. The AuthContext provides:
- `user` - Current user object
- `login(email, password)` - Login function
- `register(userData)` - Registration function
- `logout()` - Logout function
- `isAuthenticated` - Boolean auth status

## Styling

CSS is located in `App.css` with a responsive, modern design using:
- CSS Grid for layouts
- Flexbox for component alignment
- CSS custom properties for theming
- Mobile-first responsive design

## License

MIT
