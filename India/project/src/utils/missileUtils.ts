import L from 'leaflet';

export const missileTypeColors: Record<string, string> = {
  "Surface-to-Air": "#ff0000",       // Red
  "Ballistic Missile Defence": "#ff4500", // OrangeRed
  "Air-to-Air": "#0000ff",           // Blue
  "Air-to-Surface": "#008000",       // Green
  "Anti-Radiation": "#ffa500",       // Orange
  "Surface-to-Surface": "#800080",   // Purple
  "Anti-Ship": "#00ced1",            // DarkTurquoise
  "Torpedo": "#ffc0cb",              // Pink
  "Anti-Submarine System": "#FFD700", // Gold
  "SLBM": "#4b0082"                  // Indigo
};

export const getMissileTypeColor = (type: string): string => {
  return missileTypeColors[type] || '#cccccc';
};

// Create an image-based div icon for custom images
const createImageIcon = (imagePath: string): L.DivIcon => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div><img src="${imagePath}" style="width: 36px; height: 36px;" /></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

// Image paths for different launch platforms
// All images should be placed in public/images/
const defaultLaunchIcon = createImageIcon('/images/default-pin.png');        // Was: 📍
const aircraftIcon = createImageIcon('/images/aircraft.png');                // Was: 🛦
const submarineIcon = createImageIcon('/images/submarine.png');              // Was: 🛥️
const mobileLauncherIcon = createImageIcon('/images/mobile-launcher.png');   // Was: 🚚
const shipIcon = createImageIcon('/images/ship.png');                        // Was: 🚢
const groundIcon = createImageIcon('/images/ground-system.png');             // Was: 📡
const shoulderIcon = createImageIcon('/images/shoulder-missile.png');        // Was: 🧍
const vlsIcon = createImageIcon('/images/vls-rocket.png');                   // Was: 🚀

export const getIconForLaunchPlatform = (platformString?: string): L.DivIcon => {
  if (!platformString) return defaultLaunchIcon;
  const p = platformString.toLowerCase();

  if (p.includes('aircraft') || p.includes('su-30mki') || p.includes('tejas') || 
      p.includes('rafale') || p.includes('mirage') || p.includes('apache') || 
      p.includes('p-8i') || p.includes('helicopter') || p.includes('mig-29') || 
      p.includes('jaguar')) {
    return aircraftIcon;
  }
  
  if (p.includes('submarine') || p.includes('arihant')) {
    return submarineIcon;
  }
  
  if (p.includes('ship') || p.includes('warship') || p.includes('naval') || p.includes('vls')) {
    return shipIcon;
  }
  
  if (p.includes('mobile') || p.includes('vehicle') || p.includes('road') || 
      p.includes('tracked') || p.includes('launcher')) {
    return mobileLauncherIcon;
  }
  
  if (p.includes('shoulder') || p.includes('manpad')) {
    return shoulderIcon;
  }
  
  if (p.includes('ground-based') || p.includes('fixed')) {
    return groundIcon;
  }
  
  return defaultLaunchIcon;
};