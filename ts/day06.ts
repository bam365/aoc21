import Decimal from "decimal.js"
import { pipe } from "fp-ts/function"
import { MonoidSum as NumSum } from "fp-ts/number"
import { concatAll, Monoid } from "fp-ts/Monoid"
import * as ROArray from "fp-ts/ReadonlyArray"
import { match } from "ts-pattern"

import { ROArrayUtil, readLines } from "./aoclib"


const decimalSum: Monoid<Decimal> = {
    concat: (a, b) => a.plus(b),
    empty: new Decimal("0")
}

class FishModel {
    private constructor(private fish: ReadonlyArray<Decimal>) { } 

    static fromArray = (counts: ReadonlyArray<number>): FishModel => {
        const fish = Array.from({ length: 9 }, (_, i) => pipe(
            counts, 
            ROArrayUtil.count(v => v === i),
            v => new Decimal(v)
        ))
        return new FishModel(fish)
    }

    static generate = (fm: FishModel): FishModel => {
        const regenCount = fm.fish[0]
        const newFish = Array.from({ length: 9 }, (_, i) => match(i) 
            .with(6, _ => fm.fish[7].add(regenCount))
            .with(8, _ => regenCount)
            .otherwise(_ => fm.fish[i + 1])
        )
        return new FishModel(newFish)
    }

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

const generateN = (n: number) => (fm: FishModel): FishModel => 
    n <= 0 ? fm : generateN(n - 1)(FishModel.generate(fm))

const main = () => {
    const input = readInput()
    const answer = pipe(
        FishModel.fromArray(input),
        generateN(80),
        FishModel.count
    )
    const answer2 = pipe(
        FishModel.fromArray(input),
        generateN(256),
        FishModel.count
    )
    console.log(answer)
    console.log(answer2)
}

main()
