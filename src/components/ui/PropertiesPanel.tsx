
import React from 'react';
import { useStore } from '../../state/store';
// FIX: Import Layer type to use for type annotation.
import { CadEntity, Layer } from '../../types';

const PropertiesPanel: React.FC = () => {
  const selection = useStore(state => state.selection);
  const entities = useStore(state => state.entities);
  const layers = useStore(state => state.layers);
  const updateEntity = useStore(state => state.updateEntity);
  
  if (selection.length === 0) {
    return (
      <div className="w-64 bg-base-100 p-2 flex-grow">
        <h2 className="font-bold mb-2">Properties</h2>
        <p className="text-sm text-base-content/70">No selection</p>
      </div>
    );
  }

  const selectedEntities = selection.map(id => entities[id]).filter(Boolean) as CadEntity[];
  const firstEntity = selectedEntities[0];

  const handleLayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLayerId = e.target.value;
    selection.forEach(id => updateEntity(id, { layerId: newLayerId }));
  };

  return (
    <div className="w-64 bg-base-100 p-2 flex-grow">
      <h2 className="font-bold mb-2">Properties</h2>
      <div className="text-sm">
        <p>{selection.length} item(s) selected</p>
        {selection.length === 1 && <p>Type: {firstEntity.type}</p>}
        
        <div className="mt-4">
          <label className="block font-semibold">Layer</label>
          <select 
            value={firstEntity.layerId} 
            onChange={handleLayerChange}
            className="w-full p-1 bg-base-200 border border-base-300 rounded mt-1"
          >
            {/* FIX: Add explicit type for `layer` to fix type inference issue. */}
            {Object.values(layers).map((layer: Layer) => (
              <option key={layer.id} value={layer.id}>{layer.name}</option>
            ))}
          </select>
        </div>
        {/* Add more property editors here */}
      </div>
    </div>
  );
};

export default PropertiesPanel;