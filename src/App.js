import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import ThankYouPage from './components/ThankYouPage';
import AdminPanel from './components/AdminPanel';
import { useState } from 'react';

function App() {
  const [isAuthenticated] = useState(false);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? 
              <AdminPanel /> : 
              <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;