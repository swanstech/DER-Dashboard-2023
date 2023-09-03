import { Table } from '@mantine/core';

export default function SoftwareInfoTable() {
  const softwareData = {
    software_version: '11.3.1',
    uptodate: true,
    last_update: "11/06/2023",
    next_update: "25/07/2023",
  };

  const rows = [
    ['Software Version', softwareData.software_version],
    ['Up-to-date', softwareData.uptodate ? 'Yes' : 'No'],
    ['Last Update Run', softwareData.last_update],
    ['Next Update Due', softwareData.next_update],
  ].map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  ));

  return (
    <Table>
      <tbody>{rows}</tbody>
    </Table>
  );
}
