import React from 'react';
import { useMantineTheme, rem } from '@mantine/core';
import { FileAnalytics } from "tabler-icons-react";
import ComplianceInfoTable from './ComplianceInformation';

export default function DerCompliance(){
    const theme = useMantineTheme();
    const getColor = (color: string) => {
        return theme.colors?.[color]?.[theme.colorScheme === 'dark' ? 5 : 7] ?? 'inherit';
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <FileAnalytics size={rem(20)} color={getColor('violet')} style={{ marginRight: '8px' }} />
                <div style={{ fontWeight: 'bold', marginRight: '8px' }}>Compliance Information</div>
            </div>
            <ComplianceInfoTable />
        </div>
    );
}
