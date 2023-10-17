import React, { useState, useEffect } from 'react';
import AuditResults from './AuditResults'; // Import the AuditResults component

function AuditResultsPage({ uniqueId }) {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define a function to fetch audit results based on uniqueId
    const fetchAuditResults = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/audit/report/${uniqueId}`);

        if (!response.ok) {
          throw new Error('Unable to fetch audit results');
        }

        const data = await response.json();
        setAuditData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    // Call the fetchAuditResults function when the component mounts
    if (uniqueId) {
      fetchAuditResults();
    }
  }, [uniqueId]);

  return (
    <div>
      <h2>Audit Results</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && auditData && (
        <div>
          <p>Unique ID: {uniqueId}</p>
          <AuditResults uniqueId={uniqueId} auditData={auditData} />
        </div>
      )}
    </div>
  );
}

export default AuditResultsPage;
