import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_CENTER, MAP_ZOOM, MAP_MIN_ZOOM, MAP_MAX_ZOOM } from "../../constants";
import useAppStore from "../../store/appStore";
import { motion } from "framer-motion";

// Custom ISS icon
const createISSIcon = () => {
  return L.divIcon({
    html: `<div class="relative w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 animate-pulse flex items-center justify-center">
      <div class="w-4 h-4 bg-blue-200 rounded-full"></div>
    </div>`,
    iconSize: [32, 32],
    className: "iss-icon",
  });
};

const ISSMap = ({ fullscreen = false }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const issMarker = useRef(null);
  const polyline = useRef(null);
  const { iss, issPositions } = useAppStore();
  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(MAP_CENTER, MAP_ZOOM);

      // Add tile layer
      L.tileLayer(
        isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          minZoom: MAP_MIN_ZOOM,
          maxZoom: MAP_MAX_ZOOM,
        }
      ).addTo(map.current);
    }

    // Update ISS marker and trajectory
    if (iss && map.current) {
      const { latitude, longitude } = iss;

      // Update or create ISS marker
      if (issMarker.current) {
        issMarker.current.setLatLng([latitude, longitude]);
      } else {
        issMarker.current = L.marker([latitude, longitude], {
          icon: createISSIcon(),
        })
          .bindPopup(
            `<div class="font-bold">ISS Current Location</div>
           <div>Latitude: ${latitude.toFixed(3)}</div>
           <div>Longitude: ${longitude.toFixed(3)}</div>
           <div>Speed: ${iss.speed?.toFixed(0)} km/h</div>`
          )
          .addTo(map.current);
      }

      // Update trajectory polyline
      if (issPositions.length > 1) {
        const coords = issPositions.map((pos) => [
          pos.latitude,
          pos.longitude,
        ]);

        if (polyline.current) {
          polyline.current.setLatLngs(coords);
        } else {
          polyline.current = L.polyline(coords, {
            color: "#3b82f6",
            weight: 2,
            opacity: 0.7,
            dashArray: "5, 5",
          }).addTo(map.current);
        }
      }

      // Center map on ISS
      map.current.panTo([latitude, longitude]);
    }

    // Handle resize
    const handleResize = () => {
      if (map.current) {
        setTimeout(() => map.current.invalidateSize(), 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [iss, issPositions, isDark]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden ${
        fullscreen ? "w-full h-screen" : "w-full h-96"
      }`}
    >
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Info Overlay */}
      {iss && (
        <div className="absolute top-4 right-4 z-10 glass rounded-lg p-3 max-w-xs">
          <h3 className="font-bold text-sm mb-2">ISS Position</h3>
          <div className="text-xs space-y-1 text-gray-300">
            <div>Lat: {iss.latitude.toFixed(3)}°</div>
            <div>Lon: {iss.longitude.toFixed(3)}°</div>
            <div>Speed: {iss.speed?.toFixed(0)} km/h</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ISSMap;
