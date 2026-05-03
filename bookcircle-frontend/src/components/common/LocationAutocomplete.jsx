import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../services/googleMapsLoader";
import { MapPin } from "lucide-react";

export default function LocationAutocomplete({ value, onChange, onSelect }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    loadGoogleMaps()
      .then((google) => {
        if (!inputRef.current || autocompleteRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          { fields: ["formatted_address", "geometry", "name"] }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          const location = place.formatted_address || place.name || inputRef.current.value;
          const geometry = place.geometry?.location;

          onSelect({
            location,
            latitude: geometry ? geometry.lat() : null,
            longitude: geometry ? geometry.lng() : null,
          });
        });
      })
      .catch(() => {
        // Silently handle - autocomplete just won't work
      });

    return () => {
      isMounted = false;
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onSelect]);

  return (
    <div style={{ position: "relative" }}>
      <MapPin
        size={16}
        color="var(--muted)"
        style={{
          position: "absolute", left: 16, top: "50%",
          transform: "translateY(-50%)", zIndex: 5,
        }}
      />
      <input
        ref={inputRef}
        className="input"
        style={{ paddingLeft: 44 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a city or area..."
      />
    </div>
  );
}