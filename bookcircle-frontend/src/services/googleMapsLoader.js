let googleMapsPromise;

export function loadGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return Promise.reject(new Error("Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file."));
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Unable to load Google Maps"));
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}
