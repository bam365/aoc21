import Decimal from "decimal.js"
import * as fs from "fs"
import { pipe } from "fp-ts/function"
import { MonoidSum as NumSum } from "fp-ts/number"
import { Monoid } from "fp-ts/Monoid"
import * as Opt from "fp-ts/Option"
import { Ord } from "fp-ts/Ord"
import { Ordering } from "fp-ts/Ordering"
import * as ROArray from "fp-ts/ReadonlyArray"
import { ReadonlyNonEmptyArray } from "fp-ts/ReadonlyNonEmptyArray"
import * as RONEArray from "fp-ts/ReadonlyNonEmptyArray"


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

export const decimalOrd: Ord<Decimal> = {
    equals: (x, y) => x.equals(y),
    compare: (x, y) => x.comparedTo(y) as Ordering,
}

export const decimalSum: Monoid<Decimal> = {
    concat: (x, y) => Decimal.sum(x, y),
    empty: new Decimal("0")
}

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

    export const mean = (xs: ReadonlyNonEmptyArray<number>): number => {
        const l = pipe(xs, ROArray.size)
        return pipe(
            xs,
            RONEArray.map(n => n / l),
            RONEArray.concatAll(NumSum)
        )
    }
}

export module OptUtil {
    export const getExn = <T>(v: Opt.Option<T>): T => pipe(
        v,
        Opt.match(
            () => { throw new Error("option value is none") },
            v => v
        )
    )
}