import React from "react";
import AboutBackground from "../Assets/about-background.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="Background" />
      </div>

      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>
        <h1 className="primary-heading">
          Secure Your Blockchain Projects with Smart Contract Auditing
        </h1>
        <p className="primary-text">
          In the world of blockchain technology, security is paramount. Our smart contract auditing services ensure that your blockchain projects are robust and secure. Our experts meticulously review and analyze your smart contract code, identifying potential vulnerabilities and weaknesses.
        </p>
        <p className="primary-text">
          With our comprehensive auditing process, you can have confidence in the reliability and safety of your smart contracts. Protect your projects and assets with our professional smart contract auditing services.
        </p>
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>
          <button className="watch-video-button">
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;


