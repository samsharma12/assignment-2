import React from 'react';

function PreviousReports({ auditResults, onAuditResultClick }) {
  return (
    <div className="previous-reports">
      <h2>Previous Audit Reports</h2>
      <ul>
        {auditResults.map((auditResult, index) => (
          <li key={index}>
            <button onClick={() => onAuditResultClick(auditResult)}>
              View Report for {auditResult.id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PreviousReports;
