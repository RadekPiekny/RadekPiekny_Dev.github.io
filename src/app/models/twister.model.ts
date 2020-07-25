import { IPoint } from './graphic-general.model';

export class Twister {
    sectionCount: number;
    twisterSection: TwisterSection[] = [];
    topMaxWidth: number;
    bottomMaxWidth: number;
    bottomPoint: IPoint;
    movingJig: number;
    sectionAngleMax: number;
    sectionAngleMin: number;
    sectionHeightMin: number;
    sectionHeightMax: number;
    changeSectionDirection: boolean;
    points: IPoint[];
    circles: TwisterPart[];
    changeDuration: number;
    changeProgress: number;
    changePointsDiff: number[];
}

export class TwisterSection {
    angle: number;
    points: IPoint[];
    part: TwisterPart[];
    bottom: IPoint;
    top: IPoint;
    height: number;
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