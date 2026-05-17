import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';



import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Venues from './pages/Venues';
import Talents from './pages/Talents';

import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEventNew from './pages/organizer/CreateEventNew';
import EventDetails from './pages/organizer/EventDetails';


import ManagerDashboard from './pages/organizer/ManagerDashboard';
import ManageTalents from './pages/organizer/ManageTalents';
import EventDetailsManager from './pages/organizer/EventDetailsManager';

import TalentDashboard from './pages/talent/TalentDashboard';
import EventDetailsTalent from './pages/talent/EventDetailsTalent';
import Profile from './pages/Profile';
import TalentProfile from './pages/TalentProfile';

import './App.css';

// Redirect helpers for legacy manager paths
const ManagerEventRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/organizer/events/${id}/manage`} replace />;
};
const ManagerEventTalentsRedirect = () => {
  const { eventId } = useParams();
  return <Navigate to={`/organizer/events/${eventId}/talents`} replace />;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="flex-1 w-full bg-eventorz-navy relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-eventorz-violet/20 via-eventorz-navy to-eventorz-navy pointer-events-none"></div>
            <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/talents" element={<Talents />} />

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
              {/* Organizer access to talent management flows (formerly manager) */}
              <Route
                path="/organizer/talents"
                element={
                  <PrivateRoute roles={['eventOrganizer']}>
                    <ManagerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/organizer/events/:id/manage"
                element={
                  <PrivateRoute roles={['eventOrganizer']}>
                    <EventDetailsManager />
                  </PrivateRoute>
                }
              />
              <Route
                path="/organizer/events/:eventId/talents"
                element={
                  <PrivateRoute roles={['eventOrganizer']}>
                    <ManageTalents />
                  </PrivateRoute>
                }
              />


              {/* Public Talent Profile */}
              <Route path="/talents/:id" element={<TalentProfile />} />

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

              {/* Legacy manager path redirects */}
              <Route path="/manager/dashboard" element={<Navigate to="/organizer/talents" replace />} />
              <Route path="/manager/events/:id" element={<ManagerEventRedirect />} />
              <Route path="/manager/events/:eventId/talents" element={<ManagerEventTalentsRedirect />} />

              <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
            </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
