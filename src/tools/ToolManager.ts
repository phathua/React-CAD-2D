
import paper from 'paper';
import { useStore } from '../state/store';
import type { ToolName } from '../types';
import { BaseTool } from './BaseTool';
import { SelectTool } from './SelectTool';
import { LineTool } from './LineTool';
import { CircleTool } from './CircleTool';

export class ToolManager {
  private view: paper.View;
  private getState: typeof useStore.getState;
  private currentTool: BaseTool | null = null;
  private tools: Map<ToolName, BaseTool>;

  constructor(view: paper.View, getState: typeof useStore.getState) {
    this.view = view;
    this.getState = getState;
    this.tools = new Map();
    this.initializeTools();
  }

  private initializeTools() {
    this.tools.set('select', new SelectTool(this.view, this.getState));
    this.tools.set('line', new LineTool(this.view, this.getState));
    this.tools.set('circle', new CircleTool(this.view, this.getState));
    // Initialize other tools here...
    // this.tools.set('arc', new ArcTool(this.view, this.getState));
    // this.tools.set('move', new MoveTool(this.view, this.getState));
  }

  public activateTool(toolName: ToolName) {
    this.deactivateTool();
    const tool = this.tools.get(toolName);
    if (tool) {
      this.currentTool = tool;
      this.currentTool.activate();
    }
  }

  public deactivateTool() {
    if (this.currentTool) {
      this.currentTool.deactivate();
      this.currentTool = null;
    }
  }
}
