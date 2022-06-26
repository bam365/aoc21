import { pipe } from "fp-ts/function"
import * as ROArray from "fp-ts/ReadonlyArray"

import { readLines, ROArrayUtil } from "./aoclib"


type Point = {
    x: number
    y: number
}

module Point {
    export const toKey = (p: Point): string => `${p.x},${p.y}`
}

type Line = {
    a: Point
    b: Point
}

module Line {
    export const isHorizontal = (l: Line): boolean => l.a.x === l.b.x

    export const isVertical = (l: Line): boolean => l.a.y === l.b.y

    export const points = (l: Line): ReadonlyArray<Point> => {
        if (l.a.x === l.b.x) {
            return pipe(
                ROArrayUtil.inclusiveRange(Math.min(l.a.y, l.b.y), Math.max(l.a.y, l.b.y)),
                ROArray.map(y => ({ x: l.a.x, y }))
            )
        } else if (l.a.y === l.b.y) {
            return pipe(
                ROArrayUtil.inclusiveRange(Math.min(l.a.x, l.b.x), Math.max(l.a.x, l.b.x)),
                ROArray.map(x => ({ x, y: l.a.y }))
            )
        } else {
            return [] 
        }
    }
}

class LineMapper {
    private constructor(private map: Map<string, number>) {}

    static empty = (): LineMapper => new LineMapper(new Map())

    mapLine(line: Line) {
        Line.points(line).forEach(point => {
            this.incPoint(point)
        })
    }  

    private incPoint(point: Point) {
        const key = Point.toKey(point)
        const val = this.map.get(key) || 0
        this.map.set(key, val + 1)
    }

    static countPointsMultiple = (lm: LineMapper): number => {
        let ret = 0;
        lm.map.forEach((value, _key) => {
            if (value > 1) {
                ret += 1
            }
        })
        return ret
    }

}

const parsePoint = (s: string): Point => {
    const items = s.split(",")
    return { x: parseInt(items[0]), y: parseInt(items[1]) }
}

const parseLine = (s: string): Line => {
    const items = s.split(" -> ")
    return { a: parsePoint(items[0]), b: parsePoint(items[1]) }
}

const main = () => {
    const lines = pipe(
        readLines(),
        ROArray.filter(l => l !== ""),
        ROArray.map(parseLine),
        ROArray.filter(l => Line.isHorizontal(l) || Line.isVertical(l))
    )
    const lineMapper = LineMapper.empty();
    lines.forEach(line => {
        lineMapper.mapLine(line)
    })
    const answer = LineMapper.countPointsMultiple(lineMapper)
    console.log(answer)
}

main()