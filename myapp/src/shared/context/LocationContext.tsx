import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchUserLocation,
  LocationResult,
} from "@/features/business/utils/locationService";

interface LocationContextType {
  userLocation: LocationResult;
  setUserLocation: (loc: LocationResult) => void;
  isLocating: boolean;
  locationSheetVisible: boolean;
  setLocationSheetVisible: (visible: boolean) => void;
  detectLocationAgain: () => Promise<void>;
  selectCityManual: (city: string) => void;
}

const DEFAULT_LOCATION: LocationResult = {
  displayName: "Chennai, Tamil Nadu",
  city: "Chennai",
  area: "T. Nagar",
  isAutoDetected: false,
};

const LocationContext = createContext<LocationContextType>({
  userLocation: DEFAULT_LOCATION,
  setUserLocation: () => {},
  isLocating: false,
  locationSheetVisible: false,
  setLocationSheetVisible: () => {},
  detectLocationAgain: async () => {},
  selectCityManual: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<LocationResult>(DEFAULT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLocating(true);
    fetchUserLocation().then((loc) => {
      if (isMounted) {
        setUserLocation(loc);
        setIsLocating(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const detectLocationAgain = async () => {
    setIsLocating(true);
    const loc = await fetchUserLocation();
    setUserLocation(loc);
    setIsLocating(false);
  };

  const selectCityManual = (city: string) => {
    if (city === "All Locations") {
      setUserLocation({
        displayName: "Tamil Nadu",
        city: "All Locations",
        isAutoDetected: false,
      });
    } else {
      setUserLocation({
        displayName: `${city}, Tamil Nadu`,
        city,
        isAutoDetected: false,
      });
    }
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        isLocating,
        locationSheetVisible,
        setLocationSheetVisible,
        detectLocationAgain,
        selectCityManual,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

