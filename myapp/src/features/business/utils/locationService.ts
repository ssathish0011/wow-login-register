// Location utility: auto-fetches user location using Geolocation API
// and reverse-geocodes to area/city name with fallback.

export interface LocationResult {
  displayName: string;
  city: string;
  area?: string;
  isAutoDetected: boolean;
  latitude?: number;
  longitude?: number;
  error?: string;
}

const DEFAULT_LOCATION: LocationResult = {
  displayName: "Chennai, Tamil Nadu",
  city: "Chennai",
  area: "T. Nagar",
  isAutoDetected: false,
};

export async function fetchUserLocation(): Promise<LocationResult> {
  // Check if navigator.geolocation is available (Web and React Native Web/polyfilled)
  if (
    typeof navigator === "undefined" ||
    !navigator.geolocation ||
    typeof navigator.geolocation.getCurrentPosition !== "function"
  ) {
    return DEFAULT_LOCATION;
  }

  return new Promise<LocationResult>((resolve) => {
    // 6-second timeout so app never blocks
    const timeoutId = setTimeout(() => {
      resolve({
        ...DEFAULT_LOCATION,
        error: "Location request timed out. Using default location.",
      });
    }, 6000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;

        try {
          // Free reverse geocoding via BigDataCloud client API (fast & no API key required)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (response.ok) {
            const data = await response.json();
            const locality =
              data.locality || data.principalSubdivision || data.city || "";
            const city =
              data.city || data.principalSubdivision || "Chennai";
            const state = data.principalSubdivision || "Tamil Nadu";

            let displayName = `${city}, ${state}`;
            if (locality && locality !== city) {
              displayName = `${locality}, ${city}`;
            }

            resolve({
              displayName,
              city,
              area: locality || undefined,
              isAutoDetected: true,
              latitude,
              longitude,
            });
            return;
          }
        } catch {
          // Fallback if reverse geocode network fails
        }

        resolve({
          displayName: "Chennai, Tamil Nadu",
          city: "Chennai",
          isAutoDetected: true,
          latitude,
          longitude,
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        let errorMsg = "Location permission denied.";
        if (error.code === 2) errorMsg = "Location position unavailable.";
        if (error.code === 3) errorMsg = "Location request timed out.";

        resolve({
          ...DEFAULT_LOCATION,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  });
}

