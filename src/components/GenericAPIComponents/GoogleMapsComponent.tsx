import React, { useState, useEffect } from 'react';
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
  const [isClient, setIsClient] = useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);  // Component has mounted on the client side
    console.log(process.env.GOOGLE_MAPS_API_KEY);
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
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default GoogleMapComponent;
