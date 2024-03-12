import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const NewScanForm = ({derId}) => {
  const [selectedScope, setSelectedScope] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [testName, setTestName] = useState('');
  const [description, setDescription] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = () => {
    // Prepare the payload
    const payload = {
      asset_id: derId,
      created_date: selectedDate.toISOString().slice(0, -5), // Exclude timezone info
      status: selectedDate > new Date() ? "Scheduled" : "Pending", // Set status based on date
      test_name: testName,
      description: description,
    };
  
    // Make a POST request to the API
    fetch("https://t3rld8ocdl.execute-api.ap-southeast-2.amazonaws.com/test/der/pentest/new-scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setResponseMessage("Scan submitted successfully! Response: " + JSON.stringify(data));
      // You may also want to reset the form fields after successful submission
      setTestName('');
      setDescription('');
      setSelectedScope('');
      setSelectedReason('');
      setSelectedDate(new Date());
    })
    .catch(error => {
      setResponseMessage("Error submitting scan: " + error.message);
    });
  };
  
  return (
    <>
      <style>
        {`
          .new-scan-form-container {
            max-width: 100%;
            width: 100%;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          h2 {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }

          label {
            display: block;
            margin-bottom: 8px;
          }

          .form-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .form-row > * {
            width: calc(50% - 8px);
            margin-bottom: 16px;
          }

          .form-row textarea {
            width: 100%;
          }

          button {
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}
      </style>
      <div className="new-scan-form-container">
        <div className="form-row">
          <div>
            <label>Test Name:</label>
            <input value={testName} onChange={(e) => setTestName(e.target.value)} />
          </div>
          <div>
            <label>Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label>Test Scope:</label>
            <select
              id="scope"
              name="scope"
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
            >
              <option value="">Select Test Scope</option>
              <option value="Website penetration testing">Website penetration testing</option>
              <option value="API penetration testing">API penetration testing</option>
              <option value="Network penetration testing">Network penetration testing</option>
              <option value="Wireless penetration testing">Wireless penetration testing</option>
              <option value="Authorisation penetration testing">Authorisation penetration testing</option>
            </select>
          </div>
          <div>
            <label>Test Reasons:</label>
            <select
              id="reasons"
              name="reasons"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              <option value="">Select Reason</option>
              <option value="Security Standard Compliance">Security Standard Compliance</option>
              <option value="Periodic test">Periodic test</option>
              <option value="Risk Ranking">Risk Ranking</option>
              <option value="Recent Security Incident">Recent Security Incident</option>
              <option value="New enhancement and patchment">New enhancement and patchment</option>
            </select>
          </div>
        </div>
        <hr />
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
        <div>{responseMessage}</div>
      </div>
    </>
  );
};

export default NewScanForm;
