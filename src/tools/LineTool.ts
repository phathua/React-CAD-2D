
import paper from 'paper';
import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './BaseTool';
import { useStore } from '../state/store';

export class LineTool extends BaseTool {
  private startPoint: paper.Point | null = null;
  private previewLine: paper.Path.Line | null = null;

  onMouseDown(event: paper.ToolEvent) {
    if (!this.startPoint) {
      this.startPoint = event.point;
      this.previewLine = new paper.Path.Line({
        from: this.startPoint,
        to: event.point,
        strokeColor: 'red',
        strokeWidth: 1,
        dashArray: [4, 4],
      });
    } else {
      const { ortho } = this.getState().settings;
      const endPoint = ortho ? this.getOrthoPoint(this.startPoint, event.point) : event.point;

      const { addEntity, activeLayerId } = this.getState();
      addEntity({
        id: uuidv4(),
        type: 'line',
        layerId: activeLayerId,
        start: this.toPoint(this.startPoint),
        end: this.toPoint(endPoint),
      });

      this.startPoint = endPoint; // For continuous line drawing
      this.previewLine?.remove();
      this.previewLine = new paper.Path.Line({
        from: this.startPoint,
        to: event.point,
        strokeColor: 'red',
        strokeWidth: 1,
        dashArray: [4, 4],
      });
    }
  }

  onMouseMove(event: paper.ToolEvent) {
    if (this.startPoint && this.previewLine) {
      const { ortho } = this.getState().settings;
      // FIX: A paper.Path.Line is a Path with two segments. To change the endpoint, update the second segment's point.
      this.previewLine.segments[1].point = ortho ? this.getOrthoPoint(this.startPoint, event.point) : event.point;
    }
  }

  onMouseUp(event: paper.ToolEvent) {
    // In this tool, lines are created on mousedown. Mouseup does nothing.
  }

  onKeyDown(event: paper.KeyEvent) {
    if (event.key === 'escape') {
      this.reset();
    }
  }

  private reset() {
    this.startPoint = null;
    this.previewLine?.remove();
    this.previewLine = null;
  }
  
  deactivate() {
    super.deactivate();
    this.reset();
  }
}
