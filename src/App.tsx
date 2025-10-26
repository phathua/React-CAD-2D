
import React, { useEffect } from 'react';
import PaperCanvas from './components/canvas/PaperCanvas';
import Toolbar from './components/ui/Toolbar';
import LayerPanel from './components/ui/LayerPanel';
import PropertiesPanel from './components/ui/PropertiesPanel';
import StatusBar from './components/ui/StatusBar';
import CommandBar from './components/ui/CommandBar';
import { useStore } from './state/store';
import { initializeShortcuts } from './shortcuts/mousetrap';

const App: React.FC = () => {
  const isLayerPanelOpen = useStore(state => state.ui.isLayerPanelOpen);

  useEffect(() => {
    initializeShortcuts(useStore.getState);
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans bg-base-100 text-base-content overflow-hidden">
      <div className="flex-grow flex">
        <Toolbar />
        <main className="flex-grow flex flex-col relative">
          <PaperCanvas />
          <CommandBar />
        </main>
        <div className="flex flex-col bg-base-200 border-l border-base-300">
          {isLayerPanelOpen && <LayerPanel />}
          <PropertiesPanel />
        </div>
      </div>
      <StatusBar />
    </div>
  );
};

export default App;
