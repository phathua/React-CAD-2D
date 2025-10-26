
import React from 'react';
import { useStore } from '../../state/store';

const CommandBar: React.FC = () => {
  const activeTool = useStore(state => state.activeTool);

  let prompt = 'Command:';
  switch (activeTool) {
    case 'select':
      prompt = 'Select objects or drag to create a selection window.';
      break;
    case 'line':
      prompt = 'Specify first point...';
      break;
    case 'circle':
      prompt = 'Specify center point...';
      break;
    default:
      prompt = `${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}:`;
  }

  return (
    <div className="absolute bottom-0 left-0 w-full bg-base-200/80 p-2 backdrop-blur-sm">
      <p className="text-sm font-mono text-base-content">{prompt}</p>
    </div>
  );
};

export default CommandBar;
