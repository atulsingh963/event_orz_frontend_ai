import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import indiaMapBg from './assets/india_earth_satellite_map.jpg';


import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Venues from './pages/Venues';

import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEventNew from './pages/organizer/CreateEventNew';
import EventDetails from './pages/organizer/EventDetails';


import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManageTalents from './pages/manager/ManageTalents';
import EventDetailsManager from './pages/manager/EventDetailsManager';

import TalentDashboard from './pages/talent/TalentDashboard';
import EventDetailsTalent from './pages/talent/EventDetailsTalent';
import Profile from './pages/Profile';

import './App.css';
import './styles/home.css';
import './styles/venues.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content"  style={{
                  backgroundImage: `url(${indiaMapBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundAttachment: 'fixed'
                }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/venues" element={<Venues />} />

              {/* Event Organizer Routes */}
              <Route
                path="/organizer/dashboard"
                element={
                  <PrivateRoute roles={['eventOrganizer']}>
                    <OrganizerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/organizer/create-event"
                element={
                  <PrivateRoute roles={['eventOrganizer']}>
                    <CreateEventNew />
                  </PrivateRoute>
                }
              />
              <Route
                path="/organizer/events/:id"
                element={
                  <PrivateRoute roles={['eventOrganizer']}>
                    <EventDetails />
                  </PrivateRoute>
                }
              />

              {/* Event Manager Routes */}
              <Route
                path="/manager/dashboard"
                element={
                  <PrivateRoute roles={['eventManager']}>
                    <ManagerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/manager/events/:id"
                element={
                  <PrivateRoute roles={['eventManager']}>
                    <EventDetailsManager />
                  </PrivateRoute>
                }
              />
              <Route
                path="/manager/events/:eventId/talents"
                element={
                  <PrivateRoute roles={['eventManager']}>
                    <ManageTalents />
                  </PrivateRoute>
                }
              />

              {/* Talent Routes */}
              <Route
                path="/talent/dashboard"
                element={
                  <PrivateRoute roles={['talent']}>
                    <TalentDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/talent/events/:id"
                element={
                  <PrivateRoute roles={['talent']}>
                    <EventDetailsTalent />
                  </PrivateRoute>
                }
              />

              {/* Profile Route - Available for all authenticated users */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
