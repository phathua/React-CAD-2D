
import React, { useState, useEffect } from 'react';
import paper from 'paper';
import { useStore } from '../../state/store';

const StatusButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; shortcut?: string }> = ({ label, isActive, onClick, shortcut }) => (
  <button 
    onClick={onClick} 
    className={`px-3 py-0.5 text-sm rounded ${isActive ? 'bg-primary text-primary-content' : 'bg-base-100 hover:bg-base-300'}`}
    title={shortcut ? `${label} (${shortcut})` : label}
  >
    {label}
  </button>
);

const StatusBar: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const settings = useStore(state => state.settings);
  const toggleGrid = useStore(state => state.toggleGrid);
  const toggleOrtho = useStore(state => state.toggleOrtho);
  const toggleOsnap = useStore(state => state.toggleOsnap);

  useEffect(() => {
    const view = paper.view;
    if (!view) return;

    const onMouseMove = (event: paper.ToolEvent) => {
      setCoords({ x: event.point.x, y: event.point.y });
    };

    view.on('mousemove', onMouseMove);
    return () => {
      view.off('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-base-200 border-t border-base-300 text-sm">
      <div className="font-mono">
        {coords.x.toFixed(2)}, {coords.y.toFixed(2)}
      </div>
      <div className="flex items-center space-x-2">
        <StatusButton label="Grid" isActive={settings.gridVisible} onClick={toggleGrid} shortcut="G"/>
        <StatusButton label="Ortho" isActive={settings.ortho} onClick={toggleOrtho} shortcut="F8" />
        <StatusButton label="Osnap" isActive={settings.osnap} onClick={toggleOsnap} shortcut="F3" />
      </div>
    </div>
  );
};

export default StatusBar;