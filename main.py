from flask import Flask, request, jsonify
import subprocess
import uuid
import mysql.connector
import json
import os
import tempfile

from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for your entire app

# Configure MySQL database connection
db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Manav@2904",
    database="assignment2"
)
cursor = db.cursor()

# Function to run Slither analysis
def run_slither_analysis(contract_file_content):
    try:
        # Create a temporary directory to store files
        temp_dir = tempfile.mkdtemp()
        temp_filename = os.path.join(temp_dir, str(uuid.uuid4()) + ".sol")

        # Write the contract to the temporary file
        with open(temp_filename, "w") as f:
            f.write(contract_file_content.decode("utf-8"))

        # Customize Slither command based on your needs
        slither_command = ["slither", temp_filename]

        # Run Slither analysis
        slither_output = subprocess.check_output(slither_command, stderr=subprocess.STDOUT, text=True)

        # Clean up temporary file and directory
        os.remove(temp_filename)
        os.rmdir(temp_dir)

        # Process Slither output and return as needed
        slither_result = json.loads(slither_output)  # Assuming Slither output is in JSON format
        return slither_result
    except subprocess.CalledProcessError as e:
        return {"error": e.output}
    except Exception as e:
        return {"error": str(e)}

# Define the /api/audit/submit endpoint
@app.route('/api/audit/submit', methods=['POST'])
def submit_audit():
    try:
        contract_file = request.files['contractFile']
        contract_file_content = contract_file.read()

        # Run Slither analysis on the uploaded contract
        analysis_result = run_slither_analysis(contract_file_content)

        # Create a new audit report in MySQL with the analysis results
        report_id = str(uuid.uuid4())
        contract_name = contract_file.filename  # Use the uploaded file name as the contract name
        audit_date = request.form['auditDate']

        # Insert the audit report into the Reports table
        sql_insert_report = """
            INSERT INTO Reports (report_id, contract_name, audit_date)
            VALUES (%s, %s, %s)
        """
        values_report = (report_id, contract_name, audit_date)
        cursor.execute(sql_insert_report, values_report)
        db.commit()

        # Insert vulnerabilities and recommendations into the Vulnerabilities table
        for vulnerability in analysis_result['results']['detectors']:
            vulnerability_name = vulnerability['check']
            impact = vulnerability['impact']
            description = vulnerability['description']
            recommendations = vulnerability.get('recommendations', '')

            # Insert the vulnerability into the Vulnerabilities table
            sql_insert_vulnerability = """
                INSERT INTO Vulnerabilities (vulnerability_name, impact, description, recommendations)
                VALUES (%s, %s, %s, %s)
            """
            values_vulnerability = (vulnerability_name, impact, description, recommendations)
            cursor.execute(sql_insert_vulnerability, values_vulnerability)

            # Get the vulnerability_id for the newly inserted vulnerability
            vulnerability_id = cursor.lastrowid

            # Associate the vulnerability with the contract in the ReportVulnerabilities table
            sql_insert_report_vulnerability = """
                INSERT INTO ReportVulnerabilities (report_id, vulnerability_id)
                VALUES (%s, %s)
            """
            values_report_vulnerability = (report_id, vulnerability_id)
            cursor.execute(sql_insert_report_vulnerability, values_report_vulnerability)

        db.commit()

        return jsonify({"message": "Audit report submitted successfully"}), 201
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# Define the /api/audit/report/:reportId endpoint
@app.route('/api/audit/report/<string:reportId>', methods=['GET'])
def get_audit_report(reportId):
    try:
        # Retrieve the audit report from MySQL based on reportId
        sql = """
            SELECT R.report_id, R.contract_name, R.audit_date, V.vulnerability_name,
                   V.impact, V.description, V.recommendations
            FROM Reports R
            LEFT JOIN ReportVulnerabilities RV ON R.report_id = RV.report_id
            LEFT JOIN Vulnerabilities V ON RV.vulnerability_id = V.vulnerability_id
            WHERE R.report_id = %s
        """
        cursor.execute(sql, (reportId,))
        results = cursor.fetchall()

        if not results:
            return jsonify({"error": "Audit report not found"}), 404

        report = {
            "reportId": results[0][0],
            "contractName": results[0][1],
            "auditDate": results[0][2],
            "vulnerabilities": []
        }

        for row in results:
            vulnerability = {
                "vulnerabilityName": row[3],
                "impact": row[4],
                "description": row[5],
                "recommendations": row[6]
            }
            report["vulnerabilities"].append(vulnerability)

        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# Define the /api/audit/reports endpoint
@app.route('/api/audit/reports', methods=['GET'])
def get_user_reports():
    try:
        user_id = request.args.get('userId')  # Get the user ID from query parameters

        # Retrieve the user's audit reports from MySQL
        sql = """
            SELECT R.report_id, R.contract_name, R.audit_date, V.vulnerability_name,
                   V.impact, V.description, V.recommendations
            FROM Reports R
            LEFT JOIN ReportVulnerabilities RV ON R.report_id = RV.report_id
            LEFT JOIN Vulnerabilities V ON RV.vulnerability_id = V.vulnerability_id
            WHERE R.user_id = %s
        """
        cursor.execute(sql, (user_id,))
        results = cursor.fetchall()

        reports = []
        for row in results:
            report = {
                "reportId": row[0],
                "contractName": row[1],
                "auditDate": row[2],
                "vulnerabilities": []
            }
            vulnerability = {
                "vulnerabilityName": row[3],
                "impact": row[4],
                "description": row[5],
                "recommendations": row[6]
            }
            report["vulnerabilities"].append(vulnerability)
            reports.append(report)

        return jsonify({"auditReports": reports}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
