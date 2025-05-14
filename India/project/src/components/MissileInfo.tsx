import React from 'react';
import { MissileData } from '../types/types';
import { getMissileTypeColor } from '../utils/missileUtils';
import { Info, Target, Bomb, Compass, Shield, Users, Building2, FileText } from 'lucide-react';

interface MissileInfoProps {
  missile: MissileData | null;
}

const MissileInfo: React.FC<MissileInfoProps> = ({ missile }) => {
  if (!missile) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 text-sm">
        <p>Select a missile from the list to see its details. Then, click on the map to place it and visualize its range.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded-lg p-3 md:p-4 overflow-y-auto flex-grow max-h-[40vh] md:max-h-[35vh] custom-scrollbar">
      <h3 
        className="text-base md:text-lg font-bold pb-2 mb-2 md:mb-3 border-b border-gray-600 flex items-center"
        style={{ color: getMissileTypeColor(missile.type) }}
      >
        <span className="truncate">{missile.name}</span>
        <span className="ml-auto text-xs text-gray-400">{missile.range} km</span>
      </h3>
      
      <div className="space-y-2 text-xs md:text-sm">
        <div className="flex items-start">
          <Info className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-blue-400" />
          <div>
            <span className="font-semibold">Type:</span> {missile.type}
          </div>
        </div>
        
        <div className="flex items-start">
          <Target className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-red-400" />
          <div>
            <span className="font-semibold">Range:</span> {missile.range} km
          </div>
        </div>
        
        {missile.warhead && (
          <div className="flex items-start">
            <Bomb className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-yellow-400" />
            <div className="flex-1">
              <span className="font-semibold">Warhead:</span> {missile.warhead}
            </div>
          </div>
        )}
        
        {missile.propulsion && (
          <div className="flex items-start">
            <Compass className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-green-400" />
            <div className="flex-1">
              <span className="font-semibold">Propulsion:</span> {missile.propulsion}
            </div>
          </div>
        )}
        
        {missile.guidance && (
          <div className="flex items-start">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-purple-400" />
            <div className="flex-1">
              <span className="font-semibold">Guidance:</span> {missile.guidance}
            </div>
          </div>
        )}
        
        {missile.launchPlatforms && (
          <div className="flex items-start">
            <Info className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-orange-400" />
            <div className="flex-1">
              <span className="font-semibold">Launch Platforms:</span> {missile.launchPlatforms}
            </div>
          </div>
        )}
        
        {missile.users && (
          <div className="flex items-start">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-teal-400" />
            <div className="flex-1">
              <span className="font-semibold">Users:</span> {missile.users}
            </div>
          </div>
        )}
        
        {missile.developedBy && (
          <div className="flex items-start">
            <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-indigo-400" />
            <div className="flex-1">
              <span className="font-semibold">Developed by:</span> {missile.developedBy}
            </div>
          </div>
        )}
        
        {missile.notes && (
          <div className="flex items-start">
            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 mt-1 mr-2 flex-shrink-0 text-gray-400" />
            <div className="flex-1">
              <span className="font-semibold">Notes:</span> {missile.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissileInfo;