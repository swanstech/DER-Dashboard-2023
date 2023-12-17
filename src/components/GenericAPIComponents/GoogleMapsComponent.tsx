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

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure this is the correct env variable

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  center,
  zoom,
  markers = []
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);  // component has mounted on the client side
  }, []);

  return isClient && googleMapsApiKey ? (
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
  ) : null;
};

export default GoogleMapComponent;
