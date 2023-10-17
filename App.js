import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Dashboard from './Components/Dashboard';
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Testimonial from "./Components/Testimonial";
import Work from "./Components/Work";
import History from './Components/History'; // Import the History component
import AuditResults from './Components/AuditResults'; // Import the AuditResults component

function App() {
  return (
    <Router>
      <div className="App">
        
        {/* Navigation bar with links to different sections */}
        <div className="navbar-links-container">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/work">Work</Link>
          <Link to="/testimonial">Testimonials</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </div>
        
        {/* Define routes for different sections */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Route for the Home component */}
          <Route path="/about" element={<About />} /> {/* Route for the About component */}
          <Route path="/work" element={<Work />} /> {/* Route for the Work component */}
          <Route path="/testimonial" element={<Testimonial />} /> {/* Route for the Testimonial component */}
          <Route path="/contact" element={<Contact />} /> {/* Route for the Contact component */}
          <Route path="/login" element={<Login />} /> {/* Route for the Login component */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Route for the Dashboard component */}
          
          {/* Route for the history page */}
          <Route path="/history" element={<History />} /> {/* Add this line */}
          
          {/* Route for displaying audit results with a unique ID */}
          <Route path="/audit-results/:uniqueId" element={<AuditResults />} /> {/* Add this line */}
        </Routes>
        
        {/* Footer component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
