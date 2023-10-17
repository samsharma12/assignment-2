import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom"; // Import Link
import BannerBackground from "../Assets/home-banner-background.png";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="Banner Background" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Ensure Smart Contract Security with Auditing
          </h1>
          <p className="primary-text">
            Expert auditing enhances smart contract reliability and security. Validate code for vulnerabilities with professional review.
          </p>
          {/* Use Link to navigate to the login page */}
          <Link to="/login">
            <button className="secondary-button">
              Get Started <FiArrowRight />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
