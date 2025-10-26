
import React, { useRef, useEffect, useCallback } from 'react';
import paper from 'paper';
import { useStore } from '../../state/store';
import { CadEntity, Point } from '../../types';
import { ToolManager } from '../../tools/ToolManager';

const PaperCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entities = useStore(state => state.entities);
  const layers = useStore(state => state.layers);
  const activeTool = useStore(state => state.activeTool);
  const toolManagerRef = useRef<ToolManager | null>(null);

  const drawEntities = useCallback(() => {
    const project = paper.project;
    if (!project) return;
    project.activeLayer.removeChildren();

    Object.values(entities).forEach((entity: CadEntity) => {
      const layer = layers[entity.layerId];
      if (!layer || !layer.visible) return;

      let item: paper.Item | null = null;
      switch (entity.type) {
        case 'line':
          item = new paper.Path.Line({
            from: entity.start,
            to: entity.end,
          });
          break;
        case 'circle':
          item = new paper.Path.Circle({
            center: entity.center,
            radius: entity.radius,
          });
          break;
        case 'arc':
           item = new paper.Path.Arc({
             from: entity.start,
             through: entity.through,
             to: entity.end,
           });
           break;
        case 'polyline':
          const path = new paper.Path({
            segments: entity.points,
            closed: entity.closed,
          });
          item = path;
          break;
      }

      if (item) {
        item.strokeColor = new paper.Color(layer.color);
        item.strokeWidth = layer.lineWeight;
        if(layer.lineStyle === 'dashed') {
            item.dashArray = [10, 4];
        }
        item.data.id = entity.id;
      }
    });

    // FIX: Property 'draw' does not exist on type 'View'. paper.js handles redraws automatically.
  }, [entities, layers]);
  
  useEffect(() => {
    drawEntities();
  }, [drawEntities]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // FIX: The 'resize' attribute is not a standard HTML attribute and causes a TypeScript error in JSX.
    // Set it imperatively before paper.js setup to enable automatic canvas resizing.
    canvas.setAttribute('resize', 'true');
    paper.setup(canvas);
    
    if(!toolManagerRef.current){
        toolManagerRef.current = new ToolManager(paper.view, useStore.getState);
    }
    
    toolManagerRef.current.activateTool(activeTool);
    
    const view = paper.view;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const oldZoom = view.zoom;
      const oldCenter = view.center;
      const viewPosition = view.viewToProject(new paper.Point(e.offsetX, e.offsetY));
      
      let newZoom = oldZoom * (1 - e.deltaY / 1000);
      if (newZoom < 0.01) newZoom = 0.01;
      if (newZoom > 100) newZoom = 100;
      
      view.zoom = newZoom;

      const newCenter = viewPosition.subtract(viewPosition.subtract(oldCenter).multiply(oldZoom / newZoom));
      view.center = newCenter;
    };
    
    let lastPoint: paper.Point;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) { // Middle mouse button
        lastPoint = view.viewToProject(new paper.Point(e.offsetX, e.offsetY));
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 4 && lastPoint) { // Middle mouse button held down
        const currentPoint = view.viewToProject(new paper.Point(e.offsetX, e.offsetY));
        const delta = currentPoint.subtract(lastPoint);
        view.center = view.center.subtract(delta);
      }
    };

    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);

    drawEntities();

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      toolManagerRef.current?.deactivateTool();
      // paper.project.clear(); // This might cause issues with HMR
    };
  }, []);

  useEffect(() => {
    toolManagerRef.current?.activateTool(activeTool);
  }, [activeTool]);


  // FIX: Removed non-standard 'resize' attribute from JSX to resolve TypeScript error.
  return <canvas ref={canvasRef} className="w-full h-full bg-neutral-focus cursor-crosshair" />;
};

export default PaperCanvas;
