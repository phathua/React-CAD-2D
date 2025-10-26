
export type Point = [number, number];

export interface BaseEntity {
  id: string;
  layerId: string;
  type: string;
}

export interface LineEntity extends BaseEntity {
  type: 'line';
  start: Point;
  end: Point;
}

export interface CircleEntity extends BaseEntity {
  type: 'circle';
  center: Point;
  radius: number;
}

export interface ArcEntity extends BaseEntity {
  type: 'arc';
  start: Point;
  through: Point;
  end: Point;
}

export interface PolylineEntity extends BaseEntity {
  type: 'polyline';
  points: Point[];
  closed: boolean;
}

export type CadEntity = LineEntity | CircleEntity | ArcEntity | PolylineEntity;

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  lineStyle: 'solid' | 'dashed';
  lineWeight: number; // in pixels
}

export enum SnapMode {
  Endpoint = 'Endpoint',
  Midpoint = 'Midpoint',
  Center = 'Center',
}

export interface SnapPoint {
  point: Point;
  mode: SnapMode;
  entityId: string;
}

export type ToolName = 'select' | 'line' | 'circle' | 'arc' | 'polyline' | 'rectangle' | 'move' | 'rotate' | 'scale' | 'hatch';

export interface Command {
  name: string;
  execute: () => void;
}
