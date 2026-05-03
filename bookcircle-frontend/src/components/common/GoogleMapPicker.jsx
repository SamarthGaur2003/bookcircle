import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../services/googleMapsLoader";

const DEFAULT_CENTER = { lat: 18.5204, lng: 73.8567 }; // Pune, India

export default function GoogleMapPicker({ latitude, longitude, onChange }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    loadGoogleMaps()
      .then((google) => {
        const hasCoordinates = latitude != null && longitude != null;
        const center = hasCoordinates
          ? { lat: Number(latitude), lng: Number(longitude) }
          : DEFAULT_CENTER;

        mapInstance.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: hasCoordinates ? 15 : 12,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
            { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
          ]
        });

        markerInstance.current = new google.maps.Marker({
          position: center,
          map: mapInstance.current,
          draggable: true,
          animation: google.maps.Animation.DROP
        });

        markerInstance.current.addListener("dragend", () => {
          const position = markerInstance.current.getPosition();
          onChange({
            latitude: position.lat(),
            longitude: position.lng()
          });
        });

        mapInstance.current.addListener("click", (e) => {
          markerInstance.current.setPosition(e.latLng);
          onChange({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
          });
        });
      })
      .catch((error) => setLoadError(error.message));
  }, [onChange]);

  useEffect(() => {
    if (!mapInstance.current || !markerInstance.current || latitude == null || longitude == null) {
      return;
    }

    const position = { lat: Number(latitude), lng: Number(longitude) };
    markerInstance.current.setPosition(position);
    mapInstance.current.panTo(position);
  }, [latitude, longitude]);

  if (loadError) {
    return (
      <div className="glass card" style={{ padding: 24, textAlign: 'center', color: 'var(--danger)', fontSize: '0.9rem' }}>
        {loadError}
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: 350, 
        borderRadius: 16, 
        border: '1px solid var(--border)',
        overflow: 'hidden',
        background: '#0a0a0a'
      }} 
    />
  );
}
