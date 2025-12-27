import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner from './components/Banner';
import NewsTicker from './components/NewsTicker';
import CountdownTimer from './components/CountdownTimer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [config, setConfig] = useState({
    title: 'হাদির হত্যার বিচারের দাবি',
    description: 'শহীদ ওসমান হাদি হত্যার বিচারহীনতার সময়কাল',
    targetDate: '2025-12-12T14:25:00'
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/config`);
      if (response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Banner />
      <NewsTicker />
      <CountdownTimer config={config} />
    </div>
  );
}

export default App;