import React from "react";
import PickMeals from "../Assets/pick-meals-image.png";
import ChooseMeals from "../Assets/choose-image.png";
import DeliveryMeals from "../Assets/delivery-image.png";

const Work = () => {
  // Data for work information//
  const workInfoData = [
    {
      image: PickMeals,
      title: "Secure Smart Contracts",
      text: "Enhance blockchain project security. Our experts analyze smart contract code, identifying vulnerabilities.",
    },
    {
      image: ChooseMeals,
      title: "Expert Code Review",
      text: "Our team of skilled auditors assesses your smart contract code for quality, readability, and adherence to best practices.",
    },
    {
      image: DeliveryMeals,
      title: "Identify Vulnerabilities",
      text: "We pinpoint security issues, safeguarding smart contracts and bolstering resistance to potential threats.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
        Boost smart contract security with our audits. We analyze vulnerabilities, offer solutions, and strengthen your blockchain projects.
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
