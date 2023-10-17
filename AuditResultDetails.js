import React, { useEffect, useState } from 'react';
import './AuditResultDetails.css';

function AuditResultDetails({ uploadedDocumentName, uploadedDocumentUniqueId, onGoBack }) {
  const [auditDetails, setAuditDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define a function to fetch audit details based on uploadedDocumentUniqueId
    const fetchAuditDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/audit/report/${uploadedDocumentUniqueId}`);

        if (!response.ok) {
          throw new Error('Unable to fetch audit details');
        }

        const data = await response.json();
        setAuditDetails(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    // Call the fetchAuditDetails function when the component mounts
    if (uploadedDocumentUniqueId) {
      fetchAuditDetails();
    }
  }, [uploadedDocumentUniqueId]);

  const renderAuditDetails = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    if (!auditDetails) {
      return null; // Handle the case when audit details are not available
    }

    const timestampDate = new Date(auditDetails.timestamp);
    const formattedTimestamp = timestampDate.toDateString() + ', ' + timestampDate.toLocaleTimeString();

    return (
      <div className="audit-details-container">
        <h2>Audit Result Details</h2>
        <p>Uploaded Document Name: {uploadedDocumentName}</p>
        <p>Unique ID: {auditDetails.id}</p>
        <h3>Identified Vulnerabilities:</h3>
        <ul>
          {auditDetails.vulnerabilities.map((vuln, index) => (
            <li key={index} className="vulnerability-item">
              <span className="vulnerability-name">{vuln}</span> - Fix: <span className="fix-name">{auditDetails.fixes[index]}</span>
            </li>
          ))}
        </ul>
        <p>Processed At: {formattedTimestamp}</p>
        <button onClick={onGoBack}>Go Back</button>
      </div>
    );
  };

  return renderAuditDetails();
}

export default AuditResultDetails;
