import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import { MissileData } from './types/types';
import { missilesData } from './data/missilesData';

function App() {
  const [selectedMissile, setSelectedMissile] = useState<MissileData | null>(null);
  const [activeMapElements, setActiveMapElements] = useState<{
    id: string;
    position: [number, number];
    missileData: MissileData;
  }[]>([]);
  
  const handleMissileSelect = (missile: MissileData | null) => {
    setSelectedMissile(missile);
  };

  const handleMapClick = (position: [number, number]) => {
    if (selectedMissile) {
      setActiveMapElements([
        ...activeMapElements,
        {
          id: `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position,
          missileData: selectedMissile
        }
      ]);
    }
  };

  const handleMarkerRemove = (markerId: string) => {
    setActiveMapElements(activeMapElements.filter(element => element.id !== markerId));
  };

  const handleClearAllMarkers = () => {
    setActiveMapElements([]);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-900 text-gray-100 relative">
      <Sidebar 
        missiles={missilesData}
        selectedMissile={selectedMissile}
        onMissileSelect={handleMissileSelect}
        onClearAllMarkers={handleClearAllMarkers}
      />
      <div className="flex-1 h-screen w-full relative">
        <MapComponent 
          selectedMissile={selectedMissile}
          activeMapElements={activeMapElements}
          onMapClick={handleMapClick}
          onMarkerRemove={handleMarkerRemove}
          onClearAllMarkers={handleClearAllMarkers}
        />
      </div>
    </div>
  );
}

export default App;