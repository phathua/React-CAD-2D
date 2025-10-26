

import { create } from 'zustand';
import { produce } from 'immer';
import { temporal } from 'zundo';
// FIX: Add types for the store with temporal middleware to fix TypeScript errors.
import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';
import type { TemporalState } from 'zundo';

import { CadEntity, Layer, ToolName } from '../types';

interface DocumentState {
  entities: Record<string, CadEntity>;
  layers: Record<string, Layer>;
  activeLayerId: string;
}

interface EditorState {
  activeTool: ToolName;
  selection: string[];
  settings: {
    gridVisible: boolean;
    gridSize: number;
    ortho: boolean;
    osnap: boolean;
    snapModes: Set<'Endpoint' | 'Midpoint' | 'Center'>;
  };
  ui: {
    isLayerPanelOpen: boolean;
  };
  lastCommand: ToolName | null;
}

interface AppState extends DocumentState, EditorState {
  // Actions
  addEntity: (entity: CadEntity) => void;
  updateEntity: (id: string, updates: Partial<CadEntity>) => void;
  deleteEntities: (ids: string[]) => void;
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  setActiveTool: (tool: ToolName) => void;
  setSelection: (selection: string[]) => void;
  toggleGrid: () => void;
  toggleOrtho: () => void;
  toggleOsnap: () => void;
  toggleLayerPanel: () => void;
  setLastCommand: (command: ToolName | null) => void;
}

// FIX: Add types for the store with temporal middleware to fix TypeScript errors.
type UndoState = Pick<AppState, 'entities' | 'layers' | 'activeLayerId'>;

type StoreWithTemporal = UseBoundStore<StoreApi<AppState>> & {
  temporal: UseBoundStore<StoreApi<TemporalState<UndoState>>>;
};


const initialState: DocumentState & EditorState = {
  entities: {},
  layers: {
    '0': { id: '0', name: 'Default', color: '#FFFFFF', visible: true, locked: false, lineStyle: 'solid', lineWeight: 1 },
  },
  activeLayerId: '0',
  activeTool: 'select',
  selection: [],
  settings: {
    gridVisible: true,
    gridSize: 10,
    ortho: false,
    osnap: true,
    snapModes: new Set(['Endpoint', 'Midpoint', 'Center']),
  },
  ui: {
    isLayerPanelOpen: true,
  },
  lastCommand: null,
};

const stateCreator: StateCreator<AppState> = (set, get) => ({
  ...initialState,
  addEntity: (entity) => set(produce(state => {
    state.entities[entity.id] = entity;
  })),
  updateEntity: (id, updates) => set(produce(state => {
    if (state.entities[id]) {
      Object.assign(state.entities[id], updates);
    }
  })),
  deleteEntities: (ids) => set(produce(state => {
    ids.forEach(id => {
      delete state.entities[id];
    });
    state.selection = state.selection.filter(id => !ids.includes(id));
  })),
  addLayer: (layer) => set(produce(state => {
    state.layers[layer.id] = layer;
  })),
  updateLayer: (id, updates) => set(produce(state => {
    if (state.layers[id]) {
      Object.assign(state.layers[id], updates);
    }
  })),
  deleteLayer: (id) => set(produce(state => {
    if (id === '0') return; // Cannot delete default layer
    delete state.layers[id];
    if (state.activeLayerId === id) {
      state.activeLayerId = '0';
    }
    // Reassign entities on the deleted layer to the default layer
    // FIX: Add type assertion to fix type inference issue with Object.values on an Immer draft object.
    (Object.values(state.entities) as CadEntity[]).forEach(entity => {
      if (entity.layerId === id) {
        entity.layerId = '0';
      }
    });
  })),
  setActiveLayer: (id) => set({ activeLayerId: id }),
  setActiveTool: (tool) => set(state => {
    if (state.activeTool !== tool) {
       return { activeTool: tool, selection: [] };
    }
    return {};
  }),
  setSelection: (selection) => set({ selection }),
  toggleGrid: () => set(produce(state => {
    state.settings.gridVisible = !state.settings.gridVisible;
  })),
  toggleOrtho: () => set(produce(state => {
    state.settings.ortho = !state.settings.ortho;
  })),
  toggleOsnap: () => set(produce(state => {
    state.settings.osnap = !state.settings.osnap;
  })),
  toggleLayerPanel: () => set(produce(state => {
    state.ui.isLayerPanelOpen = !state.ui.isLayerPanelOpen;
  })),
  setLastCommand: (command) => set({ lastCommand: command }),
});

export const useStore = create<AppState>()(
  temporal(stateCreator, {
    partialize: (state) => {
      const { entities, layers, activeLayerId } = state;
      return { entities, layers, activeLayerId };
    },
  })
) as StoreWithTemporal;

// Expose temporal state for undo/redo controls
// The temporal store is exposed via the `.temporal` property on the main store.
export const useTemporalStore = useStore.temporal;