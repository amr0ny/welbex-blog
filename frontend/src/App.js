import React from 'react';
import Feed from './Feed.js';
import SignUp from './SignUp.js';
import SignIn from './SignIn.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Feed/>} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
