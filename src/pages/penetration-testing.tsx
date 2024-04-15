import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';
import HeaderComponent from 'n/components/Header';
import { IconLogin } from '@tabler/icons-react';
import axios from 'axios';
import TechnicalSpecifications from 'n/components/SetupComponents/TechnicalSpecifications';
import { Bolt } from 'tabler-icons-react';
import DatePicker from 'react-datepicker'; // Import a date picker library if not already present
import 'react-datepicker/dist/react-datepicker.css';
import HardwareInfoTable from 'n/components/SetupComponents/HardwareInformation';
import NewScanForm from 'n/components/NewScanForm';


const styles = {
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',

    marginRight: '465px' // Adjust as needed
  },
  detailsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },

  detailsTableHeader: {
    backgroundColor: '#3498db',
    color: 'white',
  },

  detailsTableHeaderCell: {
    padding: '10px',
    border: '1px solid #3498db',
    textAlign: 'left',
  },

  detailsTableRow: {
    border: '1px solid #3498db',
  },

  detailsTableCell: {
    padding: '12px',
    border: '1px solid #3498db',
    textAlign: 'left',
    fontSize: '12px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column', // Adjusted to column layout
    alignItems: 'stretch', // Added to stretch containers
    padding: '30px', // Adjust padding as needed
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    borderRadius: '20px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
  },

  leftContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    textAlign: 'center',
    // Center horizontally
    marginBottom: '20px', // Added margin to separate from the right container
  },
  rightContainer: {
    flex: '1',
    paddingLeft: '20px', // Adjust as needed
  },

  form: {
    marginTop: '20px',
    width: '100%',
    textAlign: 'center',
    alignItems: 'left',
    marginRight: '20px'
  },
  formLeft: {
    marginTop: '20px',
    width: '150px',
    marginLeft: '200px',
    textAlign: 'center',
    alignItems: 'center',
    height: '150px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelT: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    textAlign: 'center',
  },
  input: {
    width: '30%', // Adjust the percentage as needed
    padding: '12px',
    marginBottom: '20px',
    border: '2px solid #ccc',
    borderRadius: '3px',
    boxSizing: 'border-box',
    fontSize: '12px',
  },
  button: {
    padding: '12px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '18px',
    width: '100px',
    marginLeft: '60px'


  },

  viewResultsButton: {
    padding: '5px',
    width: '100px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
  },
  tableContainer: {
    border: '1px solid #3498db',
    borderRadius: '10px',
    marginTop: '20px',
    overflow: 'auto',
  },

  loadingSpinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #3498db',
    borderRadius: '55%',
    width: '30px',
    height: '30px',
    animation: typeof document !== 'undefined' ? 'spin 1s linear infinite' : 'none',
    display: 'inline-block',
    marginLeft: '30px',
    marginTop: '30px',
  },

  priorityHigh: {
    backgroundColor: 'red',
    color: 'white',
    padding: '3px',
    borderRadius: '5px',
  },

  priorityMedium: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '3px',
    borderRadius: '5px',
  },

  priorityLow: {
    backgroundColor: 'yellow',
    color: 'black',
    padding: '3px',
    borderRadius: '5px',
  },

  arrow: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: 'blue',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },

  pageButton: {
    padding: '8px 12px',
    margin: '0 4px',
    cursor: 'pointer',
    color: 'white',
    border: '1px solid #3498db',
    backgroundColor: '#3498db',
    borderRadius: '4px',
  },

  pageButtonHover: {
    backgroundColor: '#2980b9',
  },
};
const riskLevelStyles = {
  riskCritical: {
    backgroundColor: 'red',
    color: 'white',
    padding: '3px',
    borderRadius: '5px',
  },

  riskHigh: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '3px',
    borderRadius: '5px',
  },

  riskMedium: {
    backgroundColor: 'yellow',
    color: 'black',
    padding: '3px',
    borderRadius: '5px',
  },

  riskLow: {
    backgroundColor: 'green',
    color: 'white',
    padding: '3px',
    borderRadius: '5px',
  },
};

const leftContainer = {
  flex: '1',
  display: 'flex',
  flexDirection: 'row',  // Change to row
  justifyContent: 'space-between',  // Adjust as needed
  alignItems: 'left',
  textAlign: 'center',
  // ...
};



const PAGE_SIZE = 5;

const secret ="rLbU2MS29qqMosgElCne0yR5FpHUgQ1X";

const TestResultsTable = ({ testResults }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedColumns, setExpandedColumns] = useState([]);

  const totalPages = Math.ceil(testResults.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentResults = testResults.slice(startIndex, endIndex);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setExpandedColumns([]); // Collapse all columns when changing the page
  };

  const toggleColumnExpansion = (columnIndex) => {
    setExpandedColumns((prevExpandedColumns) => {
      const isColumnExpanded = prevExpandedColumns.includes(columnIndex);
      if (isColumnExpanded) {
        // If the column is already expanded, collapse it
        return prevExpandedColumns.filter((colIndex) => colIndex !== columnIndex);
      } else {
        // If the column is not expanded, expand it
        return [...prevExpandedColumns, columnIndex];
      }
    });
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div>
      <div style={styles.tableContainer}>
        <table style={styles.detailsTable as any}>
          <thead>
            <tr style={styles.detailsTableHeader}>
              {Object.keys(currentResults[0]).map((header, index) => (
                <th key={index} style={styles.detailsTableHeaderCell as any}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentResults.map((result, rowIndex) => (
              <tr key={rowIndex} style={styles.detailsTableRow}>
                {Object.entries(result).map(([key, value], colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      ...styles.detailsTableCell as any,
                      overflow: expandedColumns.includes(colIndex) ? 'visible' : 'hidden',

                    }}
                  >
                    {key === 'Risk Level' && (
                      <><span style={value === 'Critical'
                        ? riskLevelStyles.riskCritical
                        : (value === 'High'
                          ? riskLevelStyles.riskHigh
                          : (value === 'Medium'
                            ? riskLevelStyles.riskMedium
                            : riskLevelStyles.riskLow))}>
                        <span style={{ marginLeft: '5px' }}>{String(value)}</span>
                      </span></>
                    )}
                    {key === 'Priority' && (
                      <><span style={value === 'High' ? styles.priorityHigh : (value === 'Medium' ? styles.priorityMedium : styles.priorityLow)}>
                        <span style={{ marginLeft: '5px' }}>{String(value)}</span>
                      </span></>
                    )}
                    {key !== 'Priority' && key !== 'Risk Level' && (
                      <div>
                        {String(value).length > 40 ? (
                          <>
                            {expandedColumns.includes(colIndex) ? value : truncateText(value, 20)}
                            <span style={styles.arrow} onClick={() => toggleColumnExpansion(colIndex)}>
                              &nbsp;{expandedColumns.includes(colIndex) ? '↑' : '↓'}
                            </span>
                          </>
                        ) : String(value)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <span
            key={page}
            style={{
              ...styles.pageButton,
              backgroundColor: page === currentPage ? '#2980b9' : '#3498db',
            }}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function PenetrationTesting() {
  const router = useRouter();
  const { derId } = router.query;
  const [isAuth, setIsAuth] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [scopesArrayList, setScopes] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ fullName: string; email: string } | null>(null);
  const [keycloakInstance, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);
  let lastUserActivityTimestamp = Date.now();
  const [showResults, setShowResults] = useState(false);
  const [showNewScanForm, setShowNewScanForm] = useState(false);

  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const totalPages = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = keycloakInstance.token;
        
        const id = "device-api";
        const response = await fetch(`http://localhost:8080/realms/swanstech/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
          },
          body: `grant_type=urn:ietf:params:oauth:grant-type:uma-ticket&client_id=backend-client&client_secret=${secret}&audience=backend-client&permission=${id}&response_mode=permissions`,
        });
    
        const r = await response.json();
        if (r && r.length > 0 ) {
          // Fetch data from your API using the obtained umaTicketData or any other logic you need
          const response = await fetch(`https://yq9jgzyjta.execute-api.ap-southeast-2.amazonaws.com/test/der/pentest/scan-history`);
          const result = await response.json();
    
          // Filter the results for the specific asset ID
          const filteredData = derId
            ? result.filter(record => record[11] === derId)
            : result.filter(record => record[11] === 'DER_1');
    
          setData(filteredData);
        } else {
          console.error('Unexpected umaTicketData format:', r);
          // Handle the case where umaTicketData does not match the expected format
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [derId]);

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const visibleData = data.slice(startIndex, endIndex);

    return (
      <>
       <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created Scan Date</th>
                  <th>Status</th>
                  <th>Updated Scan Date</th>
                  <th> Action</th>
                </tr>
        </thead>
        <tbody>
      {visibleData.length > 0 ? (
        visibleData.map((scanDetail, index) => (
          <tr key={index}>
            <td>{scanDetail[8]}</td>
            <td style={{ whiteSpace: 'pre-wrap' }}>{scanDetail[9]}</td>
            <td style={{ whiteSpace: 'pre-wrap' }}>{scanDetail[5]}</td>
            <td>{scanDetail[10]}</td>
            <td style={{ whiteSpace: 'pre-wrap' }}>{scanDetail[7]}</td>
            <td>
              <button className="view-button" onClick={() => handleViewResults()}>View</button>
              <br></br>
              {userRoles.includes('General Manager') && (
                <div className="edit-delete-buttons">
                  {(scanDetail[10].includes('Pending') || scanDetail[10].includes('Scheduled')) && (
                    <>
                      <button className="edit-button">Edit</button>
                      <button className="delete-button">Delete</button>
                    </>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td>No data available</td>
        </tr>
      )}
    </tbody><style jsx>{`
      
       .bottom {
         display: flex;
         flex-direction: column;
         flex: 1;
         padding: 2px;
         justify-content: space-between;
       }
       .bottom-b {
         margin: 2px;
       }

       table {
        width: 100%;
        border-collapse: collapse;
      }
      
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      th {
        background-color: #f2f2f2;
      }
       .left, .right {
         flex: 1;
         margin: 8px;
         padding: 16px;
         border-radius: 8px;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
         display: flex;
         flex-direction: column;
       }
       .left-heading, .bottom-heading, .right-heading {
         display: flex;
         align-items: center;
         font-size: 24px;
         color: #555555;
         margin-bottom: 16px;
       }

       .edit-delete-buttons {
         display: flex;
         gap: 8px; /* Adjust the gap between buttons as needed */
       }
    
       .view-button,
       .edit-button,
       .delete-button {
         padding: 8px;
         background: #3498db;
         color: white;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         font-size: 16px;
       }
   
       
     `}</style></>


    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Update the user activity timestamp whenever there is user interaction
  const updateUserActivityTimestamp = () => {
    lastUserActivityTimestamp = Date.now();
  };
  // const [viewResultsButtonDisabled, setViewResultsButtonDisabled] = useState(false);

  // Placeholder for actual device ID
  const [testResults, setTestResults] = useState([]); // New state variable for test results

  const handleViewResults = async () => {
    setShowResults(!showResults);

    // setViewResultsButtonDisabled(true);
    try {
      const response = await fetch('/api/testResults'); // Replace with your actual API endpoint

      if (!response.ok) {
        console.error("HTTP error", response.status);

        // If there's an error, provide dummy data
        setTestResults([
          {
            "Vulnerability": "False Data Injection",
            "Risk Level": "Critical",
            "Status": "Open",
            "Discovered": "2/12/2023",
            "Discovered By": "Swans Team",
            "Resolution": "Secure communication protocols, encryption, and authentication mechanisms",
            "Priority": "High",
            "Tags": ["EVCS", "Charging Data", "Integrity"]
          },
          {
            "Vulnerability": "Man-in-the-Middle",
            "Risk Level": "High",
            "Status": "Closed",
            "Discovered": "1/12/2023",
            "Discovered By": "Unknown",
            "Resolution": "Robust encryption, authentication mechanisms, and secure communication protocols",
            "Priority": "Medium",
            "Tags": ["EVCS", "Data Transmission", "Integrity", "Confidentiality"]
          },
          {
            "Vulnerability": "Denial of Service",
            "Risk Level": "High",
            "Status": "Open",
            "Discovered": "3/12/2023",
            "Discovered By": "Unknown",
            "Resolution": "Traffic filtering, rate limiting, and anomaly detection techniques",
            "Priority": "High",
            "Tags": ["EVCS", "Network Functionality", "Reliability"]
          },
          {
            "Vulnerability": "Malware Injections",
            "Risk Level": "High",
            "Status": "Open",
            "Discovered": "10/12/2023",
            "Discovered By": "Unknown",
            "Resolution": "Regular security testing and assessment of EVSEs",
            "Priority": "High",
            "Tags": ["EVCS", "EVSEs", "Integrity"]
          },
          {
            "Vulnerability": "Physical Attack",
            "Risk Level": "Medium",
            "Status": "Closed",
            "Discovered": "1/12/2023",
            "Discovered By": "Unknown",
            "Resolution": "Surveillance systems, access controls, and tamper-resistant designs for the charging equipment",
            "Priority": "Medium",
            "Tags": ["EVCS", "Physical Security"]
          },
          {
            "Vulnerability": "Unauthorized Client",
            "Risk Level": "Medium",
            "Status": "Open",
            "Discovered": "14-12-2023",
            "Discovered By": "Unknown",
            "Resolution": "Secure communication protocols",
            "Priority": "Medium",
            "Tags": ["DER", "Communication"]
          },
          {
            "Vulnerability": "Invalid Packet",
            "Risk Level": "Medium",
            "Status": "Open",
            "Discovered": "11/12/2023",
            "Discovered By": "Unknown",
            "Resolution": "Secure communication protocols",
            "Priority": "Low",
            "Tags": ["DER", "Communication"]
          },
          {
            "Vulnerability": "Spoof TCP Handshake",
            "Risk Level": "Medium",
            "Status": "Open",
            "Discovered": "15-12-2023",
            "Discovered By": "Unknown",
            "Resolution": "Secure communication protocols",
            "Priority": "High",
            "Tags": ["DER", "Communication"]
          },
          {
            "Vulnerability": "Man-in-the-Middle Denial-of-Service",
            "Risk Level": "Medium",
            "Status": "Open",
            "Discovered": "12/12/2023",
            "Discovered By": "Unknown",
            "Resolution": "Robust encryption, authentication mechanisms, and secure communication protocols",
            "Priority": "Medium",
            "Tags": ["DER", "Data Transmission", "Integrity", "Confidentiality"]
          },
          {
            "Vulnerability": "Man-in-the-Middle Data Spoof",
            "Risk Level": "Low",
            "Status": "Closed",
            "Discovered": "3/12/2023",
            "Discovered By": "Unknown",
            "Resolution": "Robust encryption, authentication mechanisms, and secure communication protocols",
            "Priority": "High",
            "Tags": ["DER", "Data Transmission", "Integrity", "Confidentiality"]
          }
        ]
        );
        return;
      }

      const testResultsData = await response.json();
      setTestResults(testResultsData);
    } catch (error) {
      console.error("Error fetching test results:", error);

      setTestResults([
        {
          "Vulnerability": "False Data Injection",
          "Risk Level": "Critical",
          "Status": "Open",
          "Discovered": "2/12/2023",
          "Discovered By": "Swans Team",
          "Resolution": "Secure communication protocols, encryption, and authentication mechanisms",
          "Priority": "High",
          "Tags": ["EVCS", "Charging Data", "Integrity"]
        },
        {
          "Vulnerability": "Man-in-the-Middle",
          "Risk Level": "High",
          "Status": "Closed",
          "Discovered": "1/12/2023",
          "Discovered By": "Unknown",
          "Resolution": "Robust encryption, authentication mechanisms, and secure communication protocols",
          "Priority": "Medium",
          "Tags": ["EVCS", "Data Transmission", "Integrity", "Confidentiality"]
        },
        {
          "Vulnerability": "Denial of Service",
          "Risk Level": "High",
          "Status": "Open",
          "Discovered": "3/12/2023",
          "Discovered By": "Unknown",
          "Resolution": "Traffic filtering, rate limiting, and anomaly detection techniques",
          "Priority": "High",
          "Tags": ["EVCS", "Network Functionality", "Reliability"]
        },
        {
          "Vulnerability": "Malware Injections",
          "Risk Level": "High",
          "Status": "Open",
          "Discovered": "10/12/2023",
          "Discovered By": "Unknown",
          "Resolution": "Regular security testing and assessment of EVSEs",
          "Priority": "High",
          "Tags": ["EVCS", "EVSEs", "Integrity"]
        },
        {
          "Vulnerability": "Physical Attack",
          "Risk Level": "Medium",
          "Status": "Closed",
          "Discovered": "1/12/2023",
          "Discovered By": "Unknown",
          "Resolution": "Surveillance systems, access controls, and tamper-resistant designs for the charging equipment",
          "Priority": "Medium",
          "Tags": ["EVCS", "Physical Security"]
        },
        {
          "Vulnerability": "Unauthorized Client",
          "Risk Level": "Medium",
          "Status": "Open",
          "Discovered": "14-12-2023",
          "Discovered By": "Unknown",
          "Resolution": "Secure communication protocols",
          "Priority": "Medium",
          "Tags": ["DER", "Communication"]
        },
        {
          "Vulnerability": "Invalid Packet",
          "Risk Level": "Medium",
          "Status": "Open",
          "Discovered": "11/12/2023",
          "Discovered By": "Unknown",
          "Resolution": "Secure communication protocols",
          "Priority": "Low",
          "Tags": ["DER", "Communication"]
        },
        {
          "Vulnerability": "Spoof TCP Handshake",
          "Risk Level": "Medium",
          "Status": "Open",
          "Discovered": "15-12-2023",
          "Discovered By": "Unknown",
          "Resolution": "Secure communication protocols",
          "Priority": "High",
          "Tags": ["DER", "Communication"]
        },
        {
          "Vulnerability": "Man-in-the-Middle Denial-of-Service",
          "Risk Level": "Medium",
          "Status": "Open",
          "Discovered": "12/12/2023",
          "Discovered By": "Unknown",
          "Resolution": "Robust encryption, authentication mechanisms, and secure communication protocols",
          "Priority": "Medium",
          "Tags": ["DER", "Data Transmission", "Integrity", "Confidentiality"]
        },
        {
          "Vulnerability": "Man-in-the-Middle Data Spoof",
          "Risk Level": "Low",
          "Status": "Closed",
          "Discovered": "3/12/2023",
          "Discovered By": "Unknown",
          "Resolution": "Robust encryption, authentication mechanisms, and secure communication protocols",
          "Priority": "High",
          "Tags": ["DER", "Data Transmission", "Integrity", "Confidentiality"]
        }
      ]
      );
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", updateUserActivityTimestamp);
    document.addEventListener("keydown", updateUserActivityTimestamp);


    const initializeKeycloak = async () => {
      try {
        const keycloak = initKeycloak();

        if (!keycloak) {
          console.error('Keycloak object is null');
          return;
        }

        await keycloak.init({ onLoad: 'check-sso' });

        if (!keycloak.authenticated) {
          keycloak.login({ redirectUri: window.location.origin + router.pathname });
        } else {
          const roles = keycloak.tokenParsed?.realm_access?.roles || [];
          setUserRoles(roles);
          setKeycloak(keycloak);
          const fullName = keycloak.tokenParsed?.name || "";
          const email = keycloak.tokenParsed?.email || "";
          setUserProfile({ fullName, email });

          if (roles.includes('General Manager') || roles.includes("Auditor")) {
            setIsAuth(true);
            try {
              const response = await axios.post('/api/pentest', {
                // other request data
              }, {
                headers: {
                  'Authorization': `Bearer ${keycloak.token}`
                }
              });
              let scopesArray = response.data
                .map(item => item.scopes.map(scope => scope.replace('scopes:', '')))
                .flat();
              setScopes(scopesArray);
             

            } catch (apiError) {
              console.error('API Error:', apiError);
            }

            const inactivityCheckInterval = setInterval(() => {
              const currentTime = Date.now();
              const inactiveDuration = currentTime - lastUserActivityTimestamp;
              const inactivityTimeout = 10 * 60 * 1000;

              if (inactiveDuration >= inactivityTimeout) {
                keycloak.logout();
                clearInterval(inactivityCheckInterval);
              }
            }, 60 * 1000);

            return () => {
              document.removeEventListener("mousemove", updateUserActivityTimestamp);
              document.removeEventListener("keydown", updateUserActivityTimestamp);
              clearInterval(inactivityCheckInterval);
            };
          }
        }

      } catch (error) {
        console.error('Keycloak initialization error:', error);
      }
    }

    initializeKeycloak();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = keycloakInstance.token;
        
        const id = "device-api";
        const response = await fetch(`http://localhost:8080/realms/swanstech/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
          },
          body: `grant_type=urn:ietf:params:oauth:grant-type:uma-ticket&client_id=backend-client&client_secret=${secret}&audience=backend-client&permission=${id}&response_mode=permissions`,
        });
    
        const r = await response.json();
        console.log("token",r);
        if (r && r.length > 0 ) {
          // Fetch data from your API using the obtained umaTicketData or any other logic you need
          const response = await fetch(`https://yq9jgzyjta.execute-api.ap-southeast-2.amazonaws.com/test/der/pentest/scan-history`);
          const result = await response.json();
    
          // Filter the results for the specific asset ID
          const filteredData = derId
            ? result.filter(record => record[11] === derId)
            : result.filter(record => record[11] === 'DER_1');
    
          setData(filteredData);
        } else {
          console.error('Unexpected umaTicketData format:', r);
          // Handle the case where umaTicketData does not match the expected format
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [derId, keycloakInstance]);


  if (!isAuth) {
    return (
      <>
        <div className="page-layout">
          <HeaderComponent
            userRoles={userRoles}
            userProfile={userProfile}
            keycloakInstance={keycloakInstance} />
          <div className="auth-error-message">
            <p>You are not authenticated.</p>
            <p>You do not have the required role to access this page.</p>
            <p>Pls Login with the correct role by clicking on the <IconLogin size={45} /> icon at the right hand side of the Header.</p>
          </div>
        </div>
        <style jsx>{`
          .page-layout {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 50vh;
            padding: 8px;
            box-sizing: border-box;
          }
          .auth-error-message {
            text-align: center;
            margin: auto;
            max-width: 400px;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f8d7da;
            color: #721c24;
          }
          
        `}</style>
      </>
    );
  }

  const handleHideResults = () => {
    setShowResults(false);
    setTestResults([]);
  };

  return (
    <div className="page-layout">
      <HeaderComponent userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />
      <div className="top">
        {/* <div className="left">
          <div className="left-heading">
            <Bolt size="3rem" color='green' />
            <h3>DER Details</h3>
          </div>
          <div className="der-details">
            <HardwareInfoTable derId={derId} />
        
          </div>
        </div> */}
        <div className="right">
          <div className="right-heading">
            <Bolt size="3rem" color='green' />
            
            <h4>Scan History for {derId !== undefined ? derId : 'DER_1'}</h4>
          </div>

          <div className="scan-details">
            <table>
            {renderTableRows()}
            </table>
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
      {showResults && (
        <div style={styles.rightContainer as any}>
          <div className="hide-results-button" onClick={handleHideResults}>
            <button className="hide-button">Hide Results</button>
          </div>
          {/* ... (form content) */}
          {testResults.length > 0 && (
            <TestResultsTable testResults={testResults} />
          )}
        </div>
      )}
      <div className="new-scan-container">
        <button className="new-scan-button" onClick={() => setShowNewScanForm(!showNewScanForm)}>
          New Scan
        </button>
        {showNewScanForm && <NewScanForm derId={derId !== undefined ? derId : 'DER_1'}/>}
      </div>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px" alt="Swanforesight Logo" /></p>
      </div>
      <style jsx>{`
        /* Your existing styles go here */
        .page-layout {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100vh; /* full height of the viewport */
          padding: 8px;
          box-sizing: border-box;
        }
        .footer {
          text-align: center;
          padding: 8px;
          background-color: #f5f5f5; /* Add a background color to the footer */
        }
        .top {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: stretch;
          padding: 8px;
        }
        .bottom {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 2px;
          justify-content: space-between;
        }
        .bottom-b {
          margin: 2px;
        }
        .left {
          flex: 1;
          margin: 8px;
          padding: 16px;s
          width: 30%;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
          display: flex;
          flex-direction: column;
        }
        .right {
          flex: 1;
          margin: 8px;
          padding: 16px;
          width: 70%;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
          display: flex;
          flex-direction: column;
        }
        
        .left-heading, .bottom-heading, .right-heading {
          display: flex;
          align-items: center;
          font-size: 24px;
          color: #555555;
          margin-bottom: 16px;
        }

        .edit-delete-buttons {
          display: flex;
          gap: 8px; /* Adjust the gap between buttons as needed */
        }
      
        /* Add styles for the edit and delete buttons */

        .view-button,
        .edit-button,
        .delete-button {
          padding: 8px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

         .new-scan-container {
          flex: 1;
          margin: 8px;
          width: 100%;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
          display: flex;
          flex-direction: column;
          
        }
        
        .new-scan-button {
          background-color: #3498db;
          color: #fff;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
        }

        /* Your existing container styles */
        .page-layout {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100vh;
          padding: 8px;
          box-sizing: border-box;
        }

        .footer {
          text-align: center;
          padding: 8px;
          background-color: #f5f5f5;
        }

        .top {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: stretch;
          padding: 8px;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .scan-details {
          margin-bottom: 20px; /* Adjust as needed */
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f2f2f2;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
        }
        
        .pagination button {
          background-color: #4caf50;
          color: white;
          border: 1px solid #ddd;
          padding: 8px 16px;
          margin: 0 4px;
          cursor: pointer;
        }
        
        .pagination button.active {
          background-color: #45a049;
        }
        
        .pagination button:hover:not(.active) {
          background-color: #ddd;
        }
        
        /* Ensure the pagination div has a fixed height */
        .pagination {
          height: 40px; /* Adjust as needed */
        }
        
      `}</style>
    </div>
  );

}



