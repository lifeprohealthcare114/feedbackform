
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductFeedbackForm from './components/FeedbackForm';
import ThankYouPage from './components/ThankYouPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductFeedbackForm />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </Router>
  );
}

export default App;