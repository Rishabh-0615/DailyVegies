// // components/LocationAutocomplete.jsx
// import React, { useEffect, useRef } from "react";

// // ✅ Replace this with your actual key
// //const GOOGLE_MAPS_API_KEY = "AIzaSyBp2vxnypb_RIEbySnqcRaGZUMthm5n490";

// export default function LocationAutocomplete({ onLocationSelect }) {
//   const containerRef = useRef(null);

//   // ✅ Dynamically load script
//   const loadGoogleMapsScript = (callback) => {
//     if (window.google?.maps?.places?.PlaceAutocompleteElement) {
//       callback();
//       return;
//     }

//     const scriptExists = document.querySelector(`script[src*="maps.googleapis.com"]`);
//     if (!scriptExists) {
//       const script = document.createElement("script");
//       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBp2vxnypb_RIEbySnqcRaGZUMthm5n490&libraries=places&v=beta&region=IN`;
//       script.async = true;
//       script.defer = true;
//       script.onload = callback;
//       document.body.appendChild(script);
//     } else {
//       scriptExists.addEventListener("load", callback);
//     }
//   };

//   useEffect(() => {
//     loadGoogleMapsScript(() => {
//       if (window.google?.maps?.places?.PlaceAutocompleteElement && containerRef.current) {
//         const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement();

//         containerRef.current.innerHTML = "";
//         containerRef.current.appendChild(placeAutocomplete);

//         placeAutocomplete.addEventListener("gmp-placeautocomplete-placechanged", () => {
//           const place = placeAutocomplete.getPlace();
//           if (place && place.location) {
//             onLocationSelect({
//               address: place.formatted_address,
//               lat: place.location.lat,
//               lon: place.location.lng,
//             });
//           }
//         });
//       }
//     });
//   }, [onLocationSelect]);

//   return <div ref={containerRef} className="w-full h-12" />;
// }
import React, { useEffect, useRef } from "react";

export default function LocationAutocomplete({ onLocationSelect }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBp2vxnypb_RIEbySnqcRaGZUMthm5n490&libraries=places`;
        script.async = true;
        script.onload = initAutocomplete;
        document.body.appendChild(script);
      } else {
        initAutocomplete();
      }
    };

    const initAutocomplete = () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter location';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(input);

      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onLocationSelect({
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng()
          });
        }
      });
    };

    loadGoogleMaps();
  }, [onLocationSelect]);

  return <div ref={containerRef} className="w-full h-12" />;
}