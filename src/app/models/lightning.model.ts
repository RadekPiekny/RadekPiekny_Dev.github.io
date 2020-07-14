export class Lightning {
    id: number;
    parentId?: number;
    start: Point = new Point;
    startProgressParent: number = 0;
    tendency: Tendency = new Tendency;
    countPoints: number;
    points: Point[];
    pointsString: string;
    flashing: boolean;
    startWidth: number;
    endWidth: number;
    height: number;
    lightningChain: number;
    bezier: boolean;
    animationRatio: number = 0;
    animationSpeed: number;
}

export class Tendency {
    right: number;
    left: number;
}

export class Point {
    x: number;
    y: number;
    width?: number;
}

export class Line {
    p1: Point = new Point;
    p2: Point = new Point;
}

export class RND {
    x: number;
    y: number;
}

//
//
//

export interface ILightning {
    id: number;
    parentId?: number;
    start: IPoint;
    tendency: ITendency;
    points: Point[];
    startWidth: number;
    endWidth: number;
    height: number;
    Chainlightning: ILightning[];
    bezier: boolean;
    animationSpeed: number;
}

export interface ITendency {
    right: number;
    left: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface ILine {
    p1: IPoint;
    p2: IPoint;
}