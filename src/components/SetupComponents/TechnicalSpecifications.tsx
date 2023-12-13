import React from 'react';
import { useMantineTheme, rem } from '@mantine/core';
import {
    Tool,
    Apps,
} from "tabler-icons-react";
import HardwareInfoTable from './HardwareInformation';
import SoftwareInfoTable from './SoftwareInformation';

export default function DerTechnicalAccordion({derId}){
    const theme = useMantineTheme();
    const getColor = (color: string) => {
        return theme.colors?.[color]?.[theme.colorScheme === 'dark' ? 5 : 7] ?? 'inherit';
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Tool size={rem(20)} color={getColor('red')} style={{ marginRight: '8px' }} />
                    <div style={{ fontWeight: 'bold', marginRight: '8px' }}>Hardware Information</div>
                </div>
                <HardwareInfoTable derId={derId}/>
            </div>

            <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Apps size={rem(20)} color={getColor('blue')} style={{ marginRight: '8px' }} />
                    <div style={{ fontWeight: 'bold', marginRight: '8px' }}>Software Information</div>
                </div>
                <SoftwareInfoTable derId={derId}/>
            </div>
        </div>
    );
}
