import Decimal from "decimal.js"
import { pipe } from "fp-ts/function"
import { MonoidSum as NumSum } from "fp-ts/number"
import { concatAll, Monoid } from "fp-ts/Monoid"
import * as ROArray from "fp-ts/ReadonlyArray"
import { match } from "ts-pattern"

import { ROArrayUtil, modifyN, readLines } from "./aoclib"


const decimalSum: Monoid<Decimal> = {
    concat: (a, b) => a.plus(b),
    empty: new Decimal("0")
}

class FishModel {
    private constructor(private fish: ReadonlyArray<Decimal>) { } 

    static fromArray = (counts: ReadonlyArray<number>): FishModel => new FishModel(
        Array.from({ length: 9 }, (_, i) => pipe(
            counts, 
            ROArrayUtil.count(v => v === i),
            v => new Decimal(v)
        ))
    )

    static generate = (fm: FishModel): FishModel => new FishModel(
        Array.from({ length: 9 }, (_, i) => match(i) 
            .with(6, _ => fm.fish[7].add(fm.fish[0]))
            .with(8, _ => fm.fish[0])
            .otherwise(_ => fm.fish[i + 1])
        )
    )

    static count = (fm: FishModel) => pipe(fm.fish, concatAll(decimalSum))
}

const readInput = (): ReadonlyArray<number> => {
    const input = readLines()[0]
    return pipe(
        input.split(","),
        ROArray.filter(l => l !== ""),
        ROArray.map(v => parseInt(v))
    )
}

const main = () => {
    const input = readInput()
    const answerNGenerations = (n: number) => pipe(
        FishModel.fromArray(input),
        modifyN(n, FishModel.generate),
        FishModel.count
    )
    console.log(answerNGenerations(80))
    console.log(answerNGenerations(256))
}

main()
