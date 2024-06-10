'use client';
import React, { useState } from 'react';
import { Map, Marker, APIProvider } from '@vis.gl/react-google-maps';

const MapComp = ({ cafes }) => {
  const [position, setPosition] = useState({ lat: -34.6037, lng: -58.3816 });

  return (
    <APIProvider apiKey={"AIzaSyAUf9BTDlHNOfto4QrbB1_EsCeb9v6gSNQ"}>
      <div style={{ height: '100vh', width: '100%' }}>
        <Map zoom={13} center={position}>
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComp;

/*{cafes.map((cafe) => (
    <Marker
      key={cafe.place_id}
      position={{ lat: cafe.geometry.location.lat, lng: cafe.geometry.location.lng }}
    />
  ))}*/