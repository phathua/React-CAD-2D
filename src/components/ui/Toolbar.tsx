import React from 'react';
import { useStore, useTemporalStore } from '../../state/store';
import { useStore as useZustandStore } from 'zustand';
import type { ToolName } from '../../types';
import { MousePointer, LineChart, Circle, Move, RotateCcw, Scale, Layers, Undo, Redo } from 'lucide-react';

const ToolButton: React.FC<{
  label: string;
  toolName: ToolName;
  Icon: React.ElementType;
}> = ({ label, toolName, Icon }) => {
  // FIX: Select individual state slices to prevent infinite re-renders.
  // Previously, returning a new object `(state => ({...}))` caused a loop.
  const activeTool = useStore(state => state.activeTool);
  const setActiveTool = useStore(state => state.setActiveTool);
  const setLastCommand = useStore(state => state.setLastCommand);

  const isActive = activeTool === toolName;

  const handleClick = () => {
    setActiveTool(toolName);
    if (toolName !== 'select') {
      setLastCommand(toolName);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center justify-center w-16 h-16 p-2 rounded-lg transition-colors ${
        isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
      }`}
      title={`${label} (${toolName.charAt(0).toUpperCase()})`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const ActionButton: React.FC<{
  label: string;
  onClick: () => void;
  Icon: React.ElementType;
  disabled?: boolean;
}> = ({ label, onClick, Icon, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center w-16 h-16 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-300`}
      title={label}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};


const Toolbar: React.FC = () => {
  // `useTemporalStore` is a vanilla store. We use the generic `useZustandStore` hook to subscribe to it.
  const undo = useZustandStore(useTemporalStore, (state) => state.undo);
  const redo = useZustandStore(useTemporalStore, (state) => state.redo);
  const futureStates = useZustandStore(useTemporalStore, state => state.futureStates);
  const pastStates = useZustandStore(useTemporalStore, state => state.pastStates);
  const toggleLayerPanel = useStore(state => state.toggleLayerPanel);

  return (
    <div className="flex flex-col items-center p-2 bg-base-200 border-r border-base-300 space-y-2">
      <ToolButton label="Select" toolName="select" Icon={MousePointer} />
      <div className="w-full border-t border-base-300 my-2"></div>
      <ToolButton label="Line" toolName="line" Icon={LineChart} />
      <ToolButton label="Circle" toolName="circle" Icon={Circle} />
      {/* Add other tool buttons here */}
      <div className="w-full border-t border-base-300 my-2"></div>
      <ToolButton label="Move" toolName="move" Icon={Move} />
      <ToolButton label="Rotate" toolName="rotate" Icon={RotateCcw} />
      <ToolButton label="Scale" toolName="scale" Icon={Scale} />
      <div className="w-full border-t border-base-300 my-2"></div>
      <ActionButton label="Layers" onClick={toggleLayerPanel} Icon={Layers} />
      <ActionButton label="Undo" onClick={undo} Icon={Undo} disabled={pastStates.length === 0} />
      <ActionButton label="Redo" onClick={redo} Icon={Redo} disabled={futureStates.length === 0} />
    </div>
  );
};

export default Toolbar;