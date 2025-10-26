
import paper from 'paper';
import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './BaseTool';
import { useStore } from '../state/store';

export class CircleTool extends BaseTool {
  private centerPoint: paper.Point | null = null;
  // FIX: Use Shape.Circle which has a settable `radius` property, unlike Path.Circle.
  private previewCircle: paper.Shape.Circle | null = null;

  onMouseDown(event: paper.ToolEvent) {
    if (!this.centerPoint) {
      this.centerPoint = event.point;
      // FIX: Use Shape.Circle for dynamic resizing.
      this.previewCircle = new paper.Shape.Circle({
        center: this.centerPoint,
        radius: 0,
        strokeColor: 'red',
        strokeWidth: 1,
        dashArray: [4, 4],
      });
    } else {
      const radius = event.point.getDistance(this.centerPoint);
      if (radius > 0) {
        const { addEntity, activeLayerId } = this.getState();
        addEntity({
          id: uuidv4(),
          type: 'circle',
          layerId: activeLayerId,
          center: this.toPoint(this.centerPoint),
          radius: radius,
        });
      }
      this.reset();
      const { setActiveTool, setLastCommand } = useStore.getState();
      setActiveTool('circle');
      setLastCommand('circle');
    }
  }

  onMouseMove(event: paper.ToolEvent) {
    if (this.centerPoint && this.previewCircle) {
      const radius = event.point.getDistance(this.centerPoint);
      this.previewCircle.radius = radius;
    }
  }

  onMouseUp(event: paper.ToolEvent) {
    // Circles are created on the second mousedown.
  }

  onKeyDown(event: paper.KeyEvent) {
    if (event.key === 'escape') {
      this.reset();
    }
  }

  private reset() {
    this.centerPoint = null;
    this.previewCircle?.remove();
    this.previewCircle = null;
  }
  
  deactivate() {
    super.deactivate();
    this.reset();
  }
}
