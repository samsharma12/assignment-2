import React, { useState } from 'react';
import AuditResultDetails from './AuditResultDetails';
import './History.css';
import PreviousReports from './PreviousReports';

function History() {
  const [uniqueId, setUniqueId] = useState('');
  const [auditResults, setAuditResults] = useState([]);
  const [selectedAuditResult, setSelectedAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:3000/api/audit/reports';

  const handleSearchClick = async () => {
    try {
      setLoading(true);
      setError(null);

      // Define request headers
      const headers = {
        'Content-Type': 'application/json', // Set the content type
        // Add any additional headers as needed
      };

      // Define the request options
      const requestOptions = {
        method: 'GET', // Use GET method for fetching data
        headers,
      };

      // Make the API request with the constructed URL and options
      const response = await fetch(`${apiUrl}?uniqueId=${uniqueId}`, requestOptions);

      if (response.ok) {
        const data = await response.json();
        setAuditResults(data.auditReports);
      } else {
        // Handle specific HTTP error codes if needed
        if (response.status === 404) {
          setError('Audit reports not found for the provided unique ID.');
        } else {
          setError('Error fetching audit reports. Please try again.');
        }
      }
    } catch (error) {
      setError('An error occurred while fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuditResultClick = (result) => {
    setSelectedAuditResult(result);
  };

  const handleGoBack = () => {
    setSelectedAuditResult(null);
  };

  return (
    <div className="history-container">
      <header>
        <h1>Smart Contract Audit System</h1>
      </header>

      <main>
        <h1>History</h1>
        <div className="search-form">
          <label htmlFor="unique-id">Enter Unique ID:</label>
          <input
            type="text"
            id="unique-id"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            required
          />
          <button id="search-button" onClick={handleSearchClick}>
            Search
          </button>
        </div>
        <div className="result">
          {selectedAuditResult ? (
            <AuditResultDetails
              auditResult={selectedAuditResult}
              uploadedDocumentUniqueId={uniqueId} // Pass the uploaded document's unique ID
              onGoBack={handleGoBack}
            />
          ) : (
            <PreviousReports
              auditResults={auditResults}
              onAuditResultClick={handleAuditResultClick}
            />
          )}
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
      </main>

      <footer>
        <p>&copy; 2023 Smart Contract Audit System</p>
      </footer>
    </div>
  );
}

export default History;
