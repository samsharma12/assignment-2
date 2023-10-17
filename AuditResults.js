import React, { useState, useEffect } from 'react';
import './AuditResults.css'; // Import your custom CSS file
import axios from 'axios'; // Import axios for making API requests

function AuditResults(props) { // Define props as a parameter here
  const [auditResult, setAuditResult] = useState(null);

  useEffect(() => {
    // Fetch auditing results from your API endpoint
    const { reportId } = props;
    axios.get(`/api/audit/report/${reportId}`)
      .then(response => {
        setAuditResult(response.data);
      })
      .catch(error => {
        console.error('Error fetching audit results:', error);
      });
  }, [props.reportId]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'black';
    }
  };

  return (
    <div>
      <h1>Audit Results</h1>
      <div id="result">
        {auditResult && (
          <div>
            <p>Unique ID: {auditResult.contractName}</p>
            <h3>Identified Vulnerabilities:</h3>
            {auditResult.vulnerabilities.map((vuln, index) => (
              <div key={index}>
                <h4>
                  <span style={{ color: getSeverityColor(vuln.impact) }}>
                    {vuln.vulnerabilityName}
                  </span>
                </h4>
                <p>Severity: {vuln.impact}</p>
                <p>Description: {vuln.description}</p>
                {vuln.recommendations && (
                  <p>Recommendations: {vuln.recommendations}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <button id="back-button" onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  );
}

export default AuditResults;
