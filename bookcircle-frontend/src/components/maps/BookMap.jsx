import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

function BookMap({ lat, lng }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return <div>Loading...</div>;

  const center = {
    lat: Number(lat),
    lng: Number(lng)
  };

  return (
    <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={18}
        options={{ mapTypeId: 'roadmap' }}
        onLoad={(map) => {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(center);
            map.fitBounds(bounds);
            map.setZoom(18); // keep zoom fixed
        }}
        >
      {/* 🔴 CIRCLE FIRST (so marker stays on top) */}
      <Circle
        center={center}
        radius={20} // meters
        options={{
          fillColor: '#ff0000',
          fillOpacity: 0.15,
          strokeColor: '#ff0000',
          strokeOpacity: 0.4
        }}
      />

      {/* 🔴 DEFAULT MARKER (always visible) */}
      <Marker position={center} />
    </GoogleMap>
  );
}

export default BookMap;