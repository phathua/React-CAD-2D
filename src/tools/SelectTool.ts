
import paper from 'paper';
import { BaseTool } from './BaseTool';
import { useStore } from '../state/store';

export class SelectTool extends BaseTool {
  // FIX: Use Shape.Rectangle which has a settable `size` property, unlike Path.Rectangle.
  private selectionRect: paper.Shape.Rectangle | null = null;
  private startPoint: paper.Point | null = null;

  onMouseDown(event: paper.ToolEvent) {
    this.startPoint = event.point;
    const hitResult = paper.project.hitTest(event.point, {
      stroke: true,
      fill: true,
      tolerance: 5 / this.view.zoom,
    });

    if (hitResult && hitResult.item.data.id) {
      const entityId = hitResult.item.data.id;
      const currentSelection = this.getState().selection;
      const newSelection = event.modifiers.shift
        ? currentSelection.includes(entityId)
          ? currentSelection.filter(id => id !== entityId)
          : [...currentSelection, entityId]
        : [entityId];
      useStore.getState().setSelection(newSelection);
    } else {
      if(!event.modifiers.shift){
          useStore.getState().setSelection([]);
      }
      // FIX: Use Shape.Rectangle for dynamic resizing.
      this.selectionRect = new paper.Shape.Rectangle({
        point: event.point,
        size: [0, 0],
        strokeColor: 'blue',
        fillColor: new paper.Color(0, 0.5, 1, 0.2),
        dashArray: [4, 4],
      });
    }
  }

  onMouseMove(event: paper.ToolEvent) {
    if (this.selectionRect && this.startPoint) {
      this.selectionRect.size = new paper.Size(
        event.point.x - this.startPoint.x,
        event.point.y - this.startPoint.y
      );
    }
  }

  onMouseUp(event: paper.ToolEvent) {
    if (this.selectionRect) {
      const rectBounds = this.selectionRect.bounds;
      const selectedIds = paper.project.activeLayer.children
        .filter(item => item.data.id && item.isInside(rectBounds))
        .map(item => item.data.id);
      
      const currentSelection = this.getState().selection;
      const combinedSelection = [...new Set([...currentSelection, ...selectedIds])];
      useStore.getState().setSelection(combinedSelection);

      this.selectionRect.remove();
      this.selectionRect = null;
    }
    this.startPoint = null;
  }

  onKeyDown(event: paper.KeyEvent) {
    if (event.key === 'delete' || event.key === 'backspace') {
      const { selection, deleteEntities } = this.getState();
      if (selection.length > 0) {
        deleteEntities(selection);
      }
    } else if (event.key === 'escape') {
      useStore.getState().setSelection([]);
    }
  }
}
