import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    axios.get('/api/residents')
      .then(res => setResidents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Society Residents</h1>
      <ul>
        {residents.map(r => (
          <li key={r.id}>{r.name} - {r.flat_no}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
