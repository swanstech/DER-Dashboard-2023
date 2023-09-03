import { Table } from '@mantine/core';

export default function HardwareInfoTable() {
  const deviceData = {
    id: '110111011105',
    nameplate: '111100005555',
    name: 'Home Inverter 1',
    model: 'SE30K',
    manufacturer: 'Solaredge',
    location: ['34.9285° S', '138.6007° E'],
  };

  const rows = [
    ['ID', deviceData.id],
    ['Nameplate', deviceData.nameplate],
    ['Name', deviceData.name],
    ['Model', deviceData.model],
    ['Manufacturer', deviceData.manufacturer],
    [
      'Location',
      (
        <table>
          <tbody>
            <tr key="latitude">
              <td>Latitude:</td>
              <td>{deviceData.location[0]}</td>
            </tr>
            <tr key="longitude">
              <td>Longitude:</td>
              <td>{deviceData.location[1]}</td>
            </tr>
          </tbody>
        </table>
      ),
    ],
  ].map(([key, value]) => (
    <tr key={key?.toString()}> {/* Convert the key to a string */}
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
