import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, GeoJSON, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { MissileData } from '../types/types';
import { missileTypeColors, getIconForLaunchPlatform } from '../utils/missileUtils';
import 'leaflet/dist/leaflet.css';
import MapLegend from './MapLegend';

// Fix for default marker icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  selectedMissile: MissileData | null;
  activeMapElements: Array<{
    id: string;
    position: [number, number];
    missileData: MissileData;
  }>;
  onMapClick: (position: [number, number]) => void;
  onMarkerRemove: (markerId: string) => void;
}

// This component handles map events
const MapEventHandler: React.FC<{
  onMapClick: (position: [number, number]) => void;
}> = ({ onMapClick }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick([lat, lng]);
    },
  });
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  selectedMissile,
  activeMapElements,
  onMapClick,
  onMarkerRemove
}) => {
  // India's centroid position
  const indiaPosition: [number, number] = [22.0, 79.0];
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Custom CSS for map component
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-div-icon {
        background: transparent;
        border: none;
      }
      .custom-div-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.5));
      }
      .custom-popup .leaflet-popup-content-wrapper {
        background: rgba(40, 44, 52, 0.9);
        color: #ffffff;
        border-radius: 8px;
        font-size: 14px;
      }
      .custom-popup .leaflet-popup-tip {
        background: rgba(40, 44, 52, 0.9);
      }
      .leaflet-circle {
        pointer-events: none !important;
      }
      /* Larger touch targets for mobile */
      @media (max-width: 768px) {
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-popup-close-button {
          padding: 8px 8px 0 0 !important;
          font-size: 20px !important;
        }
        .leaflet-popup-content {
          margin: 14px !important;
          min-width: 200px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      fetch('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          L.geoJSON(data, {
            style: {
              color: '#0000ff',
              weight: 1,
              fillOpacity: 0.1,
              fillColor: '#ebf0ff'
            }
          }).addTo(map);
        })
        .catch(error => console.error("Error fetching or parsing GeoJSON data for India border:", error));
    }
  }, [mapRef.current]);

  // Set up handlers for mobile behavior
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      
      // Improve performance on mobile
      if (L.Browser.mobile) {
        // Handle multi-touch events for better mobile interaction
        map.on('touchstart', (e: L.LeafletEvent) => {
          const touchEvent = e as unknown as L.LeafletMouseEvent;
          if (touchEvent.originalEvent && 
              touchEvent.originalEvent instanceof TouchEvent && 
              touchEvent.originalEvent.touches.length > 1) {
            // Enable dragging for pinch-to-zoom gestures
            if (map.dragging.enabled()) {
              map.dragging.enable();
            }
          }
        });
      }
    }
  }, [mapRef.current]);

  return (
    <div className="w-full h-full flex-1">
      <MapContainer 
        center={indiaPosition} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="z-0"
        zoomControl={false} // Move the zoom control to bottom right
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler onMapClick={onMapClick} />
        
        {activeMapElements.map((element) => (
          <React.Fragment key={element.id}>
            <Marker
              position={element.position}
              icon={getIconForLaunchPlatform(element.missileData.launchPlatforms)}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e.originalEvent);
                  onMarkerRemove(element.id);
                }
              }}
            >
              <Popup className="custom-popup" closeButton={true} autoClose={true} closeOnClick={true}>
                <div className="text-sm sm:text-base">
                  <h3 className="font-bold text-base sm:text-lg">{element.missileData.name}</h3>
                  <p>Type: {element.missileData.type}</p>
                  <p>Range: {element.missileData.range} km</p>
                  {element.missileData.launchPlatforms && (
                    <p>Platform: {element.missileData.launchPlatforms}</p>
                  )}
                  <div className="mt-3 py-2 px-3 bg-red-600 rounded text-center touch-manipulation">
                    <p className="text-xs sm:text-sm text-white">Tap here to remove marker</p>
                  </div>
                </div>
              </Popup>
            </Marker>
            
            {element.missileData.range > 0 && (
              <Circle
                center={element.position}
                radius={element.missileData.range * 1000}
                pathOptions={{
                  color: missileTypeColors[element.missileData.type] || '#cccccc',
                  fillColor: missileTypeColors[element.missileData.type] || '#cccccc',
                  fillOpacity: 0.2,
                  interactive: false
                }}
              >
                <Popup className="custom-popup">
                  <div>
                    <h3 className="font-bold">{element.missileData.name}</h3>
                    <p>Range: {element.missileData.range} km</p>
                  </div>
                </Popup>
              </Circle>
            )}
          </React.Fragment>
        ))}
        
        <MapLegend />
      </MapContainer>
    </div>
  );
};

export default MapComponent;