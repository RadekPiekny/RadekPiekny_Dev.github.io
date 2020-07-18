
export class Twister {
    partCount: number;
    part: TwisterPart[] = [];
    tendencyRight: number;
    tendencyLeft: number;
    topMaxWidth: number;
    bottomMaxWidth: number;
    topStartX: number;
    topStartY: number;
    movingJig: number
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
}