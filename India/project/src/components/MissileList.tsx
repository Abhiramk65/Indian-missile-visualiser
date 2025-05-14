import React from 'react';
import { MissileData } from '../types/types';
import { getMissileTypeColor } from '../utils/missileUtils';

interface MissileListProps {
  missiles: MissileData[];
  selectedMissile: MissileData | null;
  onMissileSelect: (missile: MissileData | null) => void;
}

const MissileList: React.FC<MissileListProps> = ({ 
  missiles, 
  selectedMissile, 
  onMissileSelect 
}) => {
  return (
    <div className="mb-3 md:mb-4 flex-shrink-0">
      <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Missile Systems ({missiles.length})</h2>
      {missiles.length === 0 ? (
        <p className="text-gray-400 text-xs md:text-sm">No missiles match the current filter.</p>
      ) : (
        <ul className="space-y-1 max-h-[25vh] md:max-h-[30vh] overflow-y-auto pr-1 custom-scrollbar">
          {missiles.map((missile) => (
            <li
              key={`${missile.name}-${missile.type}`}
              className={`
                py-1.5 md:py-2 px-2 md:px-3 rounded text-xs md:text-sm cursor-pointer transition-all duration-200
                active:bg-gray-500 touch-manipulation
                ${selectedMissile && selectedMissile.name === missile.name 
                  ? 'bg-gray-600 font-medium' 
                  : 'bg-gray-700 hover:bg-gray-600'}
              `}
              onClick={() => onMissileSelect(missile)}
              style={{ 
                borderLeft: `3px solid ${getMissileTypeColor(missile.type)}` 
              }}
            >
              <div className="flex justify-between items-center">
                <span className="truncate max-w-[70%]">{missile.name}</span>
                <span className="text-xs opacity-70 ml-1 whitespace-nowrap">{missile.range} km</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">{missile.type}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MissileList;