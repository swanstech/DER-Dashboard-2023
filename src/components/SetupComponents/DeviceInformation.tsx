import React from 'react';
import { Accordion, useMantineTheme, rem } from '@mantine/core';
import {
    Tool,
    ServerCog,
    Apps,
    FileAnalytics,
  } from "tabler-icons-react";
import HardwareInfoTable from './HardwareInformation';
import NetworkInfoTable from './NetworkInfomation';
import SoftwareInfoTable from './SoftwareInformation';
import ComplianceInfoTable from './ComplianceInformation';


export default function InformationAccordion({derId}){
    const theme = useMantineTheme();
    const getColor = (color: string) => {
        return theme.colors?.[color]?.[theme.colorScheme === 'dark' ? 5 : 7] ?? 'inherit';
    };
    return (

        <Accordion variant="filled" radius="xs" chevronPosition="right" transitionDuration={700}>
        <Accordion.Item value="deviceHardware">
        <Accordion.Control icon={<Tool size={rem(20)} color={getColor('red')} />} title="Hardware Information">
            Hardware Information
        </Accordion.Control>
        <Accordion.Panel>
            <HardwareInfoTable derId={derId}/>
        </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="deviceNetwork">
        <Accordion.Control icon={<ServerCog size={rem(20)} color={getColor('yellow')} />}>
            Network Information
        </Accordion.Control>
        <Accordion.Panel>
            <NetworkInfoTable/>
        </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="deviceSoftware">
        <Accordion.Control icon={<Apps size={rem(20)} color={getColor('blue')} />}>
            Software Information
        </Accordion.Control>
        <Accordion.Panel>
            <SoftwareInfoTable derId={derId}/>
        </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="deviceCompliance">
        <Accordion.Control icon={<FileAnalytics size={rem(20)} color={getColor('violet')} />}>
            Compliance Information
        </Accordion.Control>
        <Accordion.Panel>
            <ComplianceInfoTable/>
        </Accordion.Panel>
        </Accordion.Item>
    </Accordion>
    )}
