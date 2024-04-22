import React from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

type GoogleMapProps = {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markers?: { lat: number; lng: number; label?: string }[];
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  center,
  zoom,
  markers = []
}) => {
  const [isClient, setIsClient] = React.useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setIsClient(true);  // Component has mounted on the client side
    // const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const apiKey ="AIzaSyCS0itRoE5H98DwE53ZoB4Zg0wU54v9MWE";
    if (apiKey) {
      setGoogleMapsApiKey(apiKey);
    } else {
      console.error("Google Maps API key not found in environment variables.");
    }
  }, []);

  if (!isClient || !googleMapsApiKey) {
    return null; // Return null if not on client or API key not available
  }

  return (
    <LoadScriptNext googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
      >
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={{ lat: marker.lat, lng: marker.lng }}
            label={marker.label}
          />
        ))}
        {/* Add three new markers */}
        <Marker position={{ lat: -37.72135400149699, lng: 145.57058723375837 }} label="Smart Engery Lab" />
        <Marker position={{ lat: -37.721404, lng: 145.570466 }} label="Solar Equip" />
        <Marker position={{ lat : -37.721468313328025, lng : 145.5710111259745}} label="Mount Toolebewong" />
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default GoogleMapComponent;
