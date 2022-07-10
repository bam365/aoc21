import Decimal from "decimal.js"
import { pipe } from "fp-ts/function"
import { Ord as NumOrd, MonoidSum as NumSum } from "fp-ts/number"
import { concatAll } from "fp-ts/Monoid"
import { Ord, contramap } from "fp-ts/Ord"
import * as ROArray from "fp-ts/ReadonlyArray"
import { ReadonlyNonEmptyArray } from "fp-ts/ReadonlyNonEmptyArray"
import * as RONEArray from "fp-ts/ReadonlyNonEmptyArray"
import * as SG from "fp-ts/Semigroup"

import { OptUtil, ROArrayUtil, readLines, decimalOrd, decimalSum } from "./aoclib"


type FuelResult = {
    n: number
    fuel: Decimal
}

type FuelCalc = (diff: number) => Decimal

const fuelResultOrd: Ord<FuelResult> = pipe(decimalOrd, contramap((fr: FuelResult) => fr.fuel))

const pt1FuelUsage: FuelCalc = diff => new Decimal(diff)

const makePt2FuelUsage = (positions: ReadonlyNonEmptyArray<number>): FuelCalc => {
    const minPos = pipe(positions, RONEArray.concatAll(SG.min(NumOrd)))
    const maxPos = pipe(positions, RONEArray.concatAll(SG.max(NumOrd)))
    const map = new Map()
    let count = 0;
    for (let i = minPos; i <= maxPos; i++)  {
        count += i;
        map.set(i, count)
    }
    return diff => map.get(diff)
}

const calcFuelUsage = (n: number, fuelCalc: (diff: number) => Decimal, positions: ReadonlyArray<number>): Decimal => pipe(
    positions,
    ROArray.map(pos => fuelCalc(Math.abs(pos - n))),
    concatAll(decimalSum)
)

const allFuelResults = (fuelCalc: FuelCalc) => (positions: ReadonlyNonEmptyArray<number>): ReadonlyNonEmptyArray<FuelResult> => {
    const minPos = pipe(positions, RONEArray.concatAll(SG.min(NumOrd)))
    const maxPos = pipe(positions, RONEArray.concatAll(SG.max(NumOrd)))
    return pipe(
        ROArrayUtil.inclusiveRange(minPos, maxPos),
        RONEArray.fromReadonlyArray,
        OptUtil.getExn,
        RONEArray.map(n => ({ n, fuel: calcFuelUsage(n, fuelCalc, positions) }))
    ) 
}

const getInput = (): ReadonlyNonEmptyArray<number> => pipe(
    readLines()[0].split(","),
    ROArray.filter(l => l !== ""),
    ROArray.map(l => parseInt(l)),
    RONEArray.fromReadonlyArray,
    OptUtil.getExn
)

const main = () => {
    const input = getInput();

    const doPart = (partName: string, fuelCalc: FuelCalc) => {
        const answer = pipe(
            input,
            allFuelResults(fuelCalc),
            RONEArray.concatAll(SG.min(fuelResultOrd))
        )
        console.log(`Part ${partName}`)
        console.log(JSON.stringify(answer))
    }

    doPart("1", pt1FuelUsage)
    doPart("2", makePt2FuelUsage(input))
}

main()
