Frontend Setup (React)
This document explains how to set up the frontend tier for the Society Management App on a RHEL 9 EC2 instance.

1. Install Node.js and npm
Ensure Node.js and npm are installed (already done for backend). Verify:

node -v
npm -v

2. Create React App
Navigate to the project root and create the frontend folder:

npx create-react-app frontend
cd frontend

3. Install Dependencies
Install additional packages:

npm install axios react-router-dom bootstrap

axios → for API calls

react-router-dom → for routing

bootstrap → for styling

4. Project Structure
Inside the frontend folder, structure as follows:

src/
components/
Residents.js
Payments.js
Expenses.js
Tickets.js
Visitors.js
App.js
index.js

5. Configure API Calls
Example Residents component (Residents.js):

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Residents() {
const [residents, setResidents] = useState([]);

useEffect(() => {
axios.get('http://localhost:3000/api/residents')
.then(response => setResidents(response.data));
}, []);

return (
<div>
<h2>Residents</h2>
<ul>
{residents.map(r => (
<li key={r.id}>{r.name} - Flat {r.flat_no}</li>
))}
</ul>
</div>
);
}

export default Residents;

6. Routing Setup
In App.js:

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Residents from './components/Residents';
import Payments from './components/Payments';
import Expenses from './components/Expenses';
import Tickets from './components/Tickets';
import Visitors from './components/Visitors';

function App() {
return (
<Router>
<Routes>
<Route path="/residents" element={<Residents />} />
<Route path="/payments" element={<Payments />} />
<Route path="/expenses" element={<Expenses />} />
<Route path="/tickets" element={<Tickets />} />
<Route path="/visitors" element={<Visitors />} />
</Routes>
</Router>
);
}

export default App;

7. Run Frontend
Start the React app:

npm start

The app runs on http://localhost:3000 by default. Ensure backend is running on port 3000 or adjust API URLs accordingly.

Summary

Created React frontend with create-react-app
Installed axios, react-router-dom, bootstrap
Built components for residents, payments, expenses, tickets, visitors
Configured routing in App.js
Connected frontend to backend APIs
Verified by running npm start
