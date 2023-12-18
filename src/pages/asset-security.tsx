import React from 'react';
import { Container, Title, Paper } from '@mantine/core';
import DERList from '../components/AssetManagerComponents/DERListComponent';
const DERSPage: React.FC = () => {
  return (
    <Container size="lg" my={40}>
      <Title order={1} align="center" mb={30}>
        Distributed Energy Resources (DERs)
      </Title>
      
      <Paper shadow="sm">
        <DERList />
      </Paper>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px" alt="Swanforesight Logo" /></p>
      </div>
      <style jsx>{`
        .logo-container {
          margin-right: 16px;
          align-self: center;
        }
        .footer {
          text-align: center;
          padding: 8px;
          margin-top: 150px;
          background-color: #f5f5f5; /* Add a background color to the footer */
         }
        .page-layout {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100vh; /* full height of the viewport */
          padding: 8px;
          box-sizing: border-box;
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
      `}</style>
    </Container>
    
  );
};

export default DERSPage;
