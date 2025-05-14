import React, { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { missileTypeColors } from '../utils/missileUtils';

const MapLegend: React.FC = () => {
  const map = useMap();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const legendRef = useRef<L.Control | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    // Custom control implementation
    const LegendControl = L.Control.extend({
      options: {
        position: window.innerWidth < 768 ? 'bottomleft' : 'bottomright'
      },
      
      onAdd: function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'rgba(40, 44, 52, 0.9)';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';
        div.style.color = '#fff';
        div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
        div.style.fontSize = '12px';
        div.style.lineHeight = '18px';
        div.style.marginBottom = window.innerWidth < 768 ? '15px' : '50px'; // Adjusted for mobile
        div.style.marginLeft = window.innerWidth < 768 ? '10px' : '0'; // Add margin on mobile
        div.style.marginRight = window.innerWidth < 768 ? '0' : '10px'; // Add margin on desktop
        div.style.userSelect = 'none';
        div.style.zIndex = '1000';
        div.style.maxWidth = '200px'; // Limit width for better mobile UX
        
        // Make the legend collapsible
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'pointer';
        header.style.marginBottom = '8px';
        header.style.padding = '4px';
        header.innerHTML = `
          <strong>Missile Types</strong>
          <span class="legend-toggle" style="margin-left: 8px; font-size: 14px;">${isCollapsed ? '▼' : '▲'}</span>
        `;
        div.appendChild(header);
        
        const content = document.createElement('div');
        content.className = 'legend-content';
        content.style.display = isCollapsed ? 'none' : 'block';
        content.style.marginTop = '8px';
        
        const missileTypes = Object.keys(missileTypeColors);
        
        missileTypes.forEach(type => {
          const item = document.createElement('div');
          item.style.display = 'flex';
          item.style.alignItems = 'center';
          item.style.marginTop = '4px';
          
          const colorDot = document.createElement('span');
          colorDot.style.display = 'inline-block';
          colorDot.style.width = '12px';
          colorDot.style.height = '12px';
          colorDot.style.marginRight = '8px';
          colorDot.style.backgroundColor = missileTypeColors[type];
          colorDot.style.borderRadius = '50%';
          
          const label = document.createElement('span');
          label.textContent = type;
          
          item.appendChild(colorDot);
          item.appendChild(label);
          content.appendChild(item);
        });
        
        div.appendChild(content);
        
        // Toggle legend visibility on click
        header.addEventListener('click', () => {
          setIsCollapsed(!isCollapsed);
          const newDisplay = content.style.display === 'none' ? 'block' : 'none';
          content.style.display = newDisplay;
          const toggleElement = header.querySelector('.legend-toggle');
          if (toggleElement) {
            toggleElement.textContent = newDisplay === 'none' ? '▼' : '▲';
          }
        });
        
        // Prevent map interactions when interacting with the legend (for ALL devices)
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        
        // Additional mobile-specific styling
        if ('ontouchstart' in window) {
          div.style.padding = '12px';
          header.style.paddingTop = '2px';
          header.style.paddingBottom = '2px';
        }
        
        return div;
      }
    });
    
    const legend = new LegendControl();
    legend.addTo(map);
    legendRef.current = legend;
    
    // Responsive handling for window resize
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < 768;
      const isMobile = window.innerWidth < 768;
      
      // Update collapse state if needed
      if (shouldCollapse !== isCollapsed) {
        setIsCollapsed(shouldCollapse);
        const contents = document.querySelector('.legend-content') as HTMLElement;
        if (contents) {
          contents.style.display = shouldCollapse ? 'none' : 'block';
        }
        const toggle = document.querySelector('.legend-toggle') as HTMLElement;
        if (toggle) {
          toggle.textContent = shouldCollapse ? '▼' : '▲';
        }
      }
      
      // If breakpoint changed between mobile/desktop, recreate the legend
      // to update its position (bottomleft vs bottomright)
      if (legendRef.current &&
          ((isMobile && legendRef.current.options.position === 'bottomright') || 
          (!isMobile && legendRef.current.options.position === 'bottomleft'))) {
        map.removeControl(legendRef.current);
        const newLegend = new LegendControl();
        newLegend.addTo(map);
        // Update the legend reference
        legendRef.current = newLegend;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (legendRef.current) {
        map.removeControl(legendRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [map, isCollapsed]);
  
  return null;
};

export default MapLegend;