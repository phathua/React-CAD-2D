import React from 'react';
import { useStore } from '../../state/store';
import type { Layer } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2 } from 'lucide-react';

const LayerPanel: React.FC = () => {
  // FIX: Select state slices individually to prevent infinite re-renders.
  // Creating a new object in the selector like `{...}` or `Object.values`
  // on every render was causing the component to loop.
  const layersObject = useStore(state => state.layers);
  const activeLayerId = useStore(state => state.activeLayerId);
  const addLayer = useStore(state => state.addLayer);
  const updateLayer = useStore(state => state.updateLayer);
  const deleteLayer = useStore(state => state.deleteLayer);
  const setActiveLayer = useStore(state => state.setActiveLayer);

  const layers = Object.values(layersObject);

  const handleAddLayer = () => {
    const newLayer: Layer = {
      id: uuidv4(),
      name: `Layer ${layers.length + 1}`,
      color: '#FFFFFF',
      visible: true,
      locked: false,
      lineStyle: 'solid',
      lineWeight: 1,
    };
    addLayer(newLayer);
    setActiveLayer(newLayer.id);
  };
  
  const handleUpdateLayer = (id: string, updates: Partial<Layer>) => {
    updateLayer(id, updates);
  };

  const handleNameChange = (id: string, newName: string) => {
    updateLayer(id, { name: newName });
  };


  return (
    <div className="w-64 bg-base-100 p-2 flex flex-col h-1/2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold">Layers</h2>
        <button onClick={handleAddLayer} className="p-1 hover:bg-base-300 rounded"><Plus size={16} /></button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {layers.map(layer => (
          <div
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
              layer.id === activeLayerId ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
            }`}
          >
            <input 
              type="color" 
              value={layer.color} 
              onChange={(e) => handleUpdateLayer(layer.id, { color: e.target.value })}
              className="w-6 h-6 p-0 border-none rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <input
              type="text"
              value={layer.name}
              onChange={(e) => handleNameChange(layer.id, e.target.value)}
              className="bg-transparent flex-grow outline-none focus:bg-base-300 rounded px-1"
            />
            <button onClick={(e) => { e.stopPropagation(); handleUpdateLayer(layer.id, { visible: !layer.visible }); }} className="p-1">
              {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleUpdateLayer(layer.id, { locked: !layer.locked }); }} className="p-1">
              {layer.locked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
            {layer.id !== '0' && (
              <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} className="p-1 hover:text-error">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;