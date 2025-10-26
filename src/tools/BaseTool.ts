
import paper from 'paper';
import { useStore } from '../state/store';
import type { Point } from '../types';

export abstract class BaseTool {
  protected tool: paper.Tool;
  protected view: paper.View;
  protected getState: typeof useStore.getState;

  constructor(view: paper.View, getState: typeof useStore.getState) {
    this.view = view;
    this.getState = getState;
    this.tool = new paper.Tool();
    this.tool.onMouseDown = this.onMouseDown.bind(this);
    this.tool.onMouseMove = this.onMouseMove.bind(this);
    this.tool.onMouseUp = this.onMouseUp.bind(this);
    this.tool.onKeyDown = this.onKeyDown.bind(this);
  }

  public activate() {
    this.tool.activate();
  }

  public deactivate() {
    // This is handled by paper.js when another tool is activated.
  }

  protected getOrthoPoint(startPoint: paper.Point, currentPoint: paper.Point): paper.Point {
    const dx = Math.abs(currentPoint.x - startPoint.x);
    const dy = Math.abs(currentPoint.y - startPoint.y);

    if (dx > dy) {
      return new paper.Point(currentPoint.x, startPoint.y);
    } else {
      return new paper.Point(startPoint.x, currentPoint.y);
    }
  }

  protected toPoint(p: paper.Point): Point {
    return [p.x, p.y];
  }

  protected abstract onMouseDown(event: paper.ToolEvent): void;
  protected abstract onMouseMove(event: paper.ToolEvent): void;
  protected abstract onMouseUp(event: paper.ToolEvent): void;
  protected abstract onKeyDown(event: paper.KeyEvent): void;
}
