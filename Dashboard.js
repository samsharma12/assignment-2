import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import AuditResults from './AuditResults';
import axios from 'axios';

function Dashboard() {
  const [uniqueId, setUniqueId] = useState('');
  const [showAuditResults, setShowAuditResults] = useState(false);
  const [slitherResults, setSlitherResults] = useState(null);
  const [additionalContent, setAdditionalContent] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  // Function to generate a unique ID
  const generateUniqueId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newUniqueId = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newUniqueId += characters[randomIndex];
    }
    return newUniqueId;
  };

  // Function to handle the "Analyze" button click
  const handleAnalyzeClick = async () => {
    const formData = new FormData();
    formData.append('contractFile', document.getElementById('contract-upload').files[0]);
    formData.append('auditDate', new Date().toISOString());

    try {
      // Display a message while analyzing
      setUploadStatus('Analyzing...');

      // Submit the contract for auditing
      const response = await axios.post('/api/audit/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Audit report submitted successfully');
        const newUniqueId = generateUniqueId();
        setUniqueId(newUniqueId);

        // Now, run the Slither analysis script and store the results
        runSlitherAnalysis();
      }
    } catch (error) {
      console.error('Error submitting audit report', error);
      // Display an error message
      setUploadStatus('Error: ' + error.message);
    }
  };

  // Function to run the Slither analysis
  const runSlitherAnalysis = () => {
    axios.get('/api/audit/slither')
      .then(response => {
        setSlitherResults(response.data); // Assuming the results are returned as JSON or plain text
        // Remove the analyzing message
        setUploadStatus('');
      })
      .catch(error => {
        console.error('Error running Slither analysis', error);
        // Display an error message
        setUploadStatus('Error: ' + error.message);
      });
  };

  // Function to handle the "View Audit Results" button click
  const handleViewAuditResultsClick = () => {
    setShowAuditResults(true);
  };

  // Function to load additional content
  const handleAdditionalContentClick = () => {
    // You can load additional content here, for example, from an API or a local source.
    // For now, let's simulate loading some additional content after a button click.
    const fakeAdditionalContent = "This is some additional content that you've loaded.";
    setAdditionalContent(fakeAdditionalContent);
  };

  return (
    <div>
      <header>
        <h1>Smart Contract Audit System</h1>
      </header>

      <main>
        <h2>Audit Your Smart Contract</h2>
        <label htmlFor="contract-upload">Upload your smart contract:</label>
        <input type="file" id="contract-upload" />
        <button id="upload-button" onClick={handleAnalyzeClick}>
          Analyze
        </button>
        <div id="result">
          <h2>Audit Results</h2>
          {uniqueId && <p>Unique ID: {uniqueId}</p>}
          {showAuditResults && <AuditResults uniqueId={uniqueId} />}
          
          {/* Display Slither analysis results */}
          {slitherResults && (
            <div>
              <h2>Slither Analysis Results</h2>
              <pre>{slitherResults}</pre>
            </div>
          )}

          {/* Display additional content */}
          {additionalContent && (
            <div>
              <h2>Additional Content</h2>
              <p>{additionalContent}</p>
            </div>
          )}

          {/* Display upload status message */}
          {uploadStatus && <p>{uploadStatus}</p>}

          <div id="instructions">
            <h2>Instructions</h2>
            <p>The instructions to upload and analyze your smart contract include:</p>
            <p>
              Sign In to your account <br /> - Read through the instructions and guidelines <br /> - Upload your Smart Contract{' '}
              <br /> - Read through the terms and conditions, and agree to it. <br /> - Press the Analyze Button to get the process
              started. <br /> - Press on the View Audit Results button and look at the further details regarding your contract.
            </p>
          </div>
        </div>

        <button id="view-audit-results" type="button" onClick={handleViewAuditResultsClick}>
          View Audit Results
        </button>

        {/* Add the View History button */}
        <Link to="/history">
          <button id="view-history-button" type="button">
            View History
          </button>
        </Link>
      </main>

      <footer>
        <p>&copy; 2023 Smart Contract Audit System</p>
      </footer>
    </div>
  );
}

export default Dashboard;
