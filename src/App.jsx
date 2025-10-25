import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEvent from './pages/organizer/CreateEvent';

import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManageTalents from './pages/manager/ManageTalents';

import TalentDashboard from './pages/talent/TalentDashboard';

import './App.css';
import './styles/home.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

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
                    <CreateEvent />
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

              <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
