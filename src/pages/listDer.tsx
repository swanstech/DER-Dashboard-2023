import cx from 'clsx';
// import { useState } from 'react';
import { Table} from '@mantine/core';
import classes from './der.css';


const data = [
  {
    der_id: 'DER_1',
    der_name: 'Fronius Primo 5',
    der_type: 'Inverter',
    manufacturer_id:'fronius-datamanager-card',
    manufacturer_serial_number:'0',
    manufacture_date:'12/23/2023 0:00',
    manufacturer_hw_version:'2.4D',
    manufacturer_info:'Fronius',
    manufacturer_model_number:'Fronius Galvo 1.5-1',
    sw_activation_date:'12/23/2023 0:00',
    sw_version:'3.14.1-10',
    location:'TBD',
  },
  {
    der_id: 'DER_2',
    der_name: 'spronius',
    der_type: 'Inverter',
    manufacturer_id:'fronius-datamanager-card',
    manufacturer_serial_number:'0',
    manufacture_date:'12/23/2023 0:00',
    manufacturer_hw_version:'2.4D',
    manufacturer_info:'Fronius',
    manufacturer_model_number:'Fronius Galvo 1.5-1',
    sw_activation_date:'12/23/2023 0:00',
    sw_version:'3.14.1-10',
    location:'TBD',
  },
  {
    der_id: 'DER_3',
    der_name: 'Smappee EV Charger',
    der_type: 'EV Charger',
    manufacturer_id:'TBD',
    manufacturer_serial_number:'0',
    manufacture_date:'12/23/2023 0:00',
    manufacturer_hw_version:'TBD',
    manufacturer_info:'Smappee',
    manufacturer_model_number:'Smappee EV Base 2',
    sw_activation_date:'12/23/2023 0:00',
    sw_version:'TBD',
    location:'TBD',
  },
];

export function TableScrollArea() {
  const rows = data.map((row) => (
    <Table.Tr key={row.der_id}>
      <Table.Td>{row.der_id}</Table.Td>
      <Table.Td>{row.der_name}</Table.Td>
      <Table.Td>{row.der_type}</Table.Td>
      <Table.Td>{row.manufacturer_id}</Table.Td>
      <Table.Td>{row.manufacturer_serial_number}</Table.Td>
      <Table.Td>{row.manufacture_date}</Table.Td>
      <Table.Td>{row.manufacturer_hw_version}</Table.Td>
      <Table.Td>{row.manufacturer_info}</Table.Td>
      <Table.Td>{row.manufacturer_model_number}</Table.Td>
      <Table.Td>{row.sw_activation_date}</Table.Td>
      <Table.Td>{row.sw_version}</Table.Td>
      <Table.Td>{row.location}</Table.Td>
    </Table.Tr>
  ));

  return (
      <Table miw={700}>
        <Table.Thead className={cx(classes.header)}>
          <Table.Tr>
            <Table.Th>der_id</Table.Th>
            <Table.Th>der_name</Table.Th>
            <Table.Th>der_type</Table.Th>
            <Table.Th>manufacturer_id</Table.Th>
            <Table.Th>manufacturer_serial_number</Table.Th>
            <Table.Th>manufacture_date</Table.Th>
            <Table.Th>manufacturer_hw_version</Table.Th>
            <Table.Th>manufacturer_info</Table.Th>
            <Table.Th>manufacturer_model_number</Table.Th>
            <Table.Th>sw_activation_date</Table.Th>
            <Table.Th>sw_version</Table.Th>
            <Table.Th>location</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
  );
}