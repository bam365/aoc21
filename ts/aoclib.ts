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

export const modifyN = <T>(n: number, f: (v: T) => T) => (init: T): T => 
    n <= 0 ? init : modifyN(n - 1, f)(f(init))

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

    export const count = <T>(pred: (v: T) => boolean) => (xs: ReadonlyArray<T>): number => pipe(
        xs,
        ROArray.filter(pred),
        ROArray.size,
    )
}
