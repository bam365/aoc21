import * as fs from "fs"
import { pipe } from "fp-ts/function"
import * as ROArray from "fp-ts/ReadonlyArray"


export const readLines = (): readonly string[] => pipe(
    fs.readFileSync(0).toString().split("\n"),
    ROArray.fromArray
)

export const readNumbers = (): readonly number[] => pipe(
    readLines(),
    ROArray.filter(s => s !== ""),
    ROArray.map(s => Number(s))
)

export module ROArrayUtil {
    export const group = <T>(sep: (v: T) => boolean) => (xs: ReadonlyArray<T>): ReadonlyArray<ReadonlyArray<T>> => {
        if (xs.length === 0) {
            return []
        } else {
            const g = pipe(xs, ROArray.takeLeftWhile(v => !sep(v)))
            const newXs = pipe(
                xs,
                ROArray.dropLeftWhile(v => !sep(v)),
                ROArray.dropLeft(1)
            )
            return [g, ...group(sep)(newXs)]
        }
    }

    export const inclusiveRange = (from: number, to: number): ReadonlyArray<number> => 
        Array.from({ length: (to - from) + 1 }, (_, i) => i + from)
   
}