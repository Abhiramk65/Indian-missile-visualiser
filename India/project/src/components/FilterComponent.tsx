import React, { useMemo } from 'react';
import { MissileData } from '../types/types';
import { Filter } from 'lucide-react';

interface FilterComponentProps {
  missiles: MissileData[];
  currentFilter: string;
  onFilterChange: (type: string) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ 
  missiles, 
  currentFilter, 
  onFilterChange 
}) => {
  const missileTypes = useMemo(() => {
    const types = new Set<string>();
    missiles.forEach(missile => {
      types.add(missile.type);
    });
    return ["All", ...Array.from(types)].sort();
  }, [missiles]);

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <label htmlFor="type-filter" className="text-sm font-medium">
          Filter by Type:
        </label>
      </div>
      <select
        id="type-filter"
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      >
        {missileTypes.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterComponent;