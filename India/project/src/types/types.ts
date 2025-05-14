export interface MissileData {
  name: string;
  type: string;
  range: number;
  warhead?: string;
  propulsion?: string;
  guidance?: string;
  launchPlatforms?: string;
  users?: string;
  developedBy?: string;
  notes?: string;
}

export type MissileType = 
  | 'Surface-to-Air'
  | 'Ballistic Missile Defence'
  | 'Air-to-Air'
  | 'Air-to-Surface'
  | 'Anti-Radiation'
  | 'Surface-to-Surface'
  | 'Anti-Ship'
  | 'Torpedo'
  | 'Anti-Submarine System'
  | 'SLBM';

export interface MapElement {
  id: string;
  position: [number, number];
  missileData: MissileData;
}