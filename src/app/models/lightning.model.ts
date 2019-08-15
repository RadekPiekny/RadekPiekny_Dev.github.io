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
}

export class RND {
    x: number;
    y: number;
}
