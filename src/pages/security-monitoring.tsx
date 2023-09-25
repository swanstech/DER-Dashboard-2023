import GoogleMapComponent from '../components/GenericAPIComponents/GoogleMapsComponent'

export default function Home() {
  const googleMapsApiKey = "AIzaSyBUDint2L3vIZI9juEw2ecSG37Frt5aT24" || "";  

  return (
    <div>
      <h1>Google Maps in Next.js</h1>
      <GoogleMapComponent
        center={{ lat: 37.7749, lng: -122.4194 }}
        zoom={10}
        googleMapsApiKey={googleMapsApiKey}
        markers={[
          { lat: 37.7749, lng: -122.4194, label: 'A' },
        ]}
      />
    </div>
  );
}
