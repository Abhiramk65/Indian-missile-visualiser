import React, { useState, useEffect } from 'react';
import MissileList from './MissileList';
import MissileInfo from './MissileInfo';
import FilterComponent from './FilterComponent';
import { MissileData } from '../types/types';
import { Rocket, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

interface SidebarProps {
  missiles: MissileData[];
  selectedMissile: MissileData | null;
  onMissileSelect: (missile: MissileData | null) => void;
  onClearAllMarkers: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  missiles, 
  selectedMissile, 
  onMissileSelect,
  onClearAllMarkers
}) => {
  const [filterType, setFilterType] = useState<string>("All");
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  const filteredMissiles = filterType === "All" 
    ? missiles 
    : missiles.filter(missile => missile.type === filterType);

  // This useEffect will run whenever filterType or missiles change
  useEffect(() => {
    // If there's a selected missile, check if it's still in the filtered list
    if (selectedMissile) {
      const isSelectedMissileInFilteredList = filteredMissiles.some(
        missile => missile.name === selectedMissile.name && missile.type === selectedMissile.type
      );
      
      // If the selected missile is not in the filtered list
      if (!isSelectedMissileInFilteredList) {
        // Option 1: Clear the selection
        // onMissileSelect(null);
        
        // Option 2: Select the first missile of the new filtered type (if available)
        if (filteredMissiles.length > 0) {
          onMissileSelect(filteredMissiles[0]);
        } else {
          onMissileSelect(null);
        }
      }
    }
  }, [filterType, missiles, selectedMissile, filteredMissiles, onMissileSelect]);

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  // Close sidebar automatically on small screens after missile selection
  const handleMissileSelect = (missile: MissileData | null) => {
    onMissileSelect(missile);
    // On mobile, hide the sidebar after selection to show the map
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button - only visible on small screens */}
      <button 
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="md:hidden fixed top-2 left-2 z-50 bg-gray-800 p-2 rounded-full shadow-lg"
        aria-label={isSidebarVisible ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarVisible ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div 
        className={`
          ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
          transform transition-transform duration-300 ease-in-out
          fixed md:static z-40 top-0 left-0 h-full 
          w-full sm:w-3/4 md:w-1/3 lg:w-1/4 
          bg-gray-800 p-4 overflow-y-auto border-r border-gray-700 flex flex-col
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-bold">Indian Missile Arsenal</h1>
          </div>
          {/* Close button for mobile - only visible on sidebar open & small screens */}
          <button 
            onClick={() => setIsSidebarVisible(false)}
            className="md:hidden text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <div 
          className="bg-gray-700 rounded-lg mb-4 overflow-hidden cursor-pointer"
          onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
        >
          <div className="p-3 flex justify-between items-center bg-gray-600">
            <span className="font-bold">How to use</span>
            {isInstructionsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          {isInstructionsOpen && (
            <div className="p-3 text-sm">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Optionally, filter missiles by type</li>
                <li>Select a missile from the list to view details</li>
                <li>Click on the map to place the selected missile</li>
                <li>The missile's range will display as a circle</li>
                <li>Click on a marker to remove it</li>
                <li>Use "Clear All Markers" to reset the map</li>
              </ol>
            </div>
          )}
        </div>

        <FilterComponent 
          missiles={missiles} 
          currentFilter={filterType} 
          onFilterChange={handleFilterChange} 
        />
        
        <div className="flex-1 min-h-0 flex flex-col">
          <MissileList 
            missiles={filteredMissiles} 
            selectedMissile={selectedMissile} 
            onMissileSelect={handleMissileSelect}  // Use the wrapped handler
          />
          
          <MissileInfo missile={selectedMissile} />
        </div>
        
        <button 
          onClick={onClearAllMarkers}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded transition-colors duration-200 mt-4 font-medium flex items-center justify-center touch-manipulation hidden md:flex"
        >
          Clear All Markers
        </button>
      </div>
    </>
  );
};

export default Sidebar;