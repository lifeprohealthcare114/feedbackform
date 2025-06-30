import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../image/logo.png';
import '../css/feedback.css';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuthenticated') === 'true'
  );
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/.netlify/functions/verifyAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const response = await fetch('/.netlify/functions/getFeedback');
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          setFeedbacks(data);
        } catch (err) {
          setError('Failed to load feedback. Please refresh.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

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
          {error && <p className="error">{error}</p>}
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
          localStorage.removeItem('adminAuthenticated');
          setIsAuthenticated(false);
          navigate('/');
        }} 
        className="back-button"
      >
        Logout
      </button>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.length === 0 ? (
            <p>No feedback submissions yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Satisfaction</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td>{feedback.name}</td>
                    <td>{feedback.email}</td>
                    <td>{feedback.productInterest}</td>
                    <td>{feedback.productSatisfaction}/5</td>
                    <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;