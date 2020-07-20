export class Twister {
    partCount: number;
    part: TwisterPart[] = [];
    topMaxWidth: number;
    bottomMaxWidth: number;
    topStartX: number;
    topStartY: number;
    movingJig: number;
    tendencyRight: number;
    tendencyLeft: number;

}

export class TwisterSection {
    angle: number;
    points: IPoint[];
    bottom: IPoint;
    top: IPoint;
    yDiff: number;
    xdiff: number;
}

export class TwisterSection_Creation {
    minAngle: number;
    maxAngle: number;
    minPartCount: number;
    maxPartCount: number;
}

export class TwisterPart {
    x: number;
    y: number;
    r: number;
    scaleHorizontal: number;
    scaleVertical: number;
    skewHorizontal: number;
    skewVertical: number;
    moveHorizontal: number;
    moveVertical: number;
    colorStart: string;
    colorEnd: string;
    tendencyRight: number;
    tendencyLeft: number;
}

export interface IPoint {
    x: number;
    y: number;
}