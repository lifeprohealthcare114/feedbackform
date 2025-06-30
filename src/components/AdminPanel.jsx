import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../image/logo.png';
import '../css/feedback.css';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check (replace with your actual password)
    if (password === 'LifeproHealthcare114') {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <img src={logo} alt="Life Pro Healthcare" className="logo" />
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <img src={logo} alt="Life Pro Healthcare" className="logo" />
      <h1>Feedback Submissions</h1>
      <button 
        onClick={() => {
          setIsAuthenticated(false);
          navigate('/');
        }} 
        className="back-button"
      >
        Logout
      </button>
      
      <div className="feedback-info">
        <p>Feedback submissions are now managed through Netlify Forms.</p>
        <p>To view submissions:</p>
        <ol>
          <li>Go to the Netlify dashboard</li>
          <li>Navigate to your site</li>
          <li>Click on the "Forms" tab</li>
          <li>Select the "feedback" form to view submissions</li>
        </ol>
        <p>You can export submissions as CSV or set up email notifications.</p>
      </div>
    </div>
  );
};

export default AdminPanel;