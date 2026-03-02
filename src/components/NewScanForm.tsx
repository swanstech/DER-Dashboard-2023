import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const NewScanForm = ({derId, token}) => {
  const [selectedScope, setSelectedScope] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [testName, setTestName] = useState('');
  const [description, setDescription] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [customerId, setCustomerId] = useState('d96e0382-8e88-4092-a4c1-0b4c179d06c2');
  const [responseMessage, setResponseMessage] = useState('');


  const handleSubmit = () => {
    const payload = {
      test_id: "T_" + Date.now(),
      customer_id: customerId,
      test_name: testName,
      description: description,
      test_expected_outcome: expectedOutcome,
      test_main_contact_id: "MC_10",
      asset_id: derId,
      status: "OPEN",
      created_by: "joshua.hee",
    };


    fetch("https://sfvqg6lsf9.execute-api.ap-southeast-2.amazonaws.com/testing/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
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
      setResponseMessage("Test request submitted successfully!");
      setTestName('');
      setDescription('');
      setExpectedOutcome('');
      setSelectedScope('');
      setSelectedReason('');
      setSelectedDate(new Date());
    })
    .catch(error => {
      setResponseMessage("Error submitting request: " + error.message);
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
          label { display: block; margin-bottom: 8px; }
          .form-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .form-row > * {
            width: calc(50% - 8px);
            margin-bottom: 16px;
          }
          .form-row textarea { width: 100%; }
          .submit-button {
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .success-message { color: green; margin-top: 10px; }
          .error-message { color: red; margin-top: 10px; }
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
            <label>Expected Outcome:</label>
            <textarea value={expectedOutcome} onChange={(e) => setExpectedOutcome(e.target.value)} />
          </div>
          <div>
            <label>Customer:</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="d96e0382-8e88-4092-a4c1-0b4c179d06c2">Acme Corporation</option>
              <option value="75a0d786-75b9-42b7-9617-d7f8f2882ec4">Globex Energy</option>
            </select>
          </div>
          <div>
            <label>Test Scope:</label>
            <select value={selectedScope} onChange={(e) => setSelectedScope(e.target.value)}>
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
            <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
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
        <div className={responseMessage.includes("Error") ? "error-message" : "success-message"}>
          {responseMessage}
        </div>
      </div>
    </>
  );
};


export default NewScanForm;
