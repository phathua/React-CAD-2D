
import Mousetrap from 'mousetrap';
import { useStore } from '../state/store';

export function initializeShortcuts(getState: typeof useStore.getState) {
  const { setActiveTool, setLastCommand } = useStore.getState();
  const temporalStore = useStore.temporal;

  // Tool selection
  Mousetrap.bind('v space', () => setActiveTool('select'));
  Mousetrap.bind('l space', () => { setActiveTool('line'); setLastCommand('line'); });
  Mousetrap.bind('c space', () => { setActiveTool('circle'); setLastCommand('circle'); });
  Mousetrap.bind('r space', () => { setActiveTool('rectangle'); setLastCommand('rectangle'); });
  Mousetrap.bind('a space', () => { setActiveTool('arc'); setLastCommand('arc'); });
  Mousetrap.bind('m space', () => { setActiveTool('move'); setLastCommand('move'); });
  Mousetrap.bind('ro space', () => { setActiveTool('rotate'); setLastCommand('rotate'); });
  Mousetrap.bind('s space', () => { setActiveTool('scale'); setLastCommand('scale'); });
  Mousetrap.bind('h space', () => { setActiveTool('hatch'); setLastCommand('hatch'); });

  // Settings toggles
  Mousetrap.bind('g', () => useStore.getState().toggleGrid());
  Mousetrap.bind('f8', () => {
    useStore.getState().toggleOrtho();
    return false; // prevent default browser action
  });
  Mousetrap.bind('f3', () => {
    useStore.getState().toggleOsnap();
    return false; // prevent default browser action
  });

  // Actions
  Mousetrap.bind(['del', 'backspace'], () => {
    const { selection, deleteEntities } = getState();
    if (selection.length > 0) {
      deleteEntities(selection);
    }
  });

  Mousetrap.bind('esc', () => {
    setActiveTool('select');
    setLastCommand(null);
  });
  
  Mousetrap.bind('space', () => {
    const { lastCommand } = getState();
    if(lastCommand) {
        setActiveTool(lastCommand);
    }
  });

  // Undo/Redo
  // FIX: Access undo/redo actions via `getState()` when outside of a React component.
  Mousetrap.bind(['command+z', 'ctrl+z'], () => temporalStore.getState().undo());
  Mousetrap.bind(['command+shift+z', 'ctrl+y'], () => temporalStore.getState().redo());

  // Zoom
  Mousetrap.bind('z e', () => {
    // This needs to be implemented in PaperCanvas as it requires access to paper.view
    // A simple way is to use a Zustand state to trigger it.
    console.log('Zoom Extents triggered');
  });
}