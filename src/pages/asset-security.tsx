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
    </Container>
  );
};

export default DERSPage;
