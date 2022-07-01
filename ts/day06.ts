import { pipe } from "fp-ts/function"
import { MonoidSum as NumSum } from "fp-ts/number"
import { concatAll } from "fp-ts/Monoid"
import * as ROArray from "fp-ts/ReadonlyArray"
import { match } from "ts-pattern"

import { ROArrayUtil, readLines } from "./aoclib"


class FishModel {
    private constructor(private fish: ReadonlyArray<number>) { } 

    static fromArray = (counts: ReadonlyArray<number>): FishModel => {
        const fish = Array.from({ length: 9 }, (_, i) => pipe(counts, ROArrayUtil.count(v => v === i)))
        return new FishModel(fish)
    }

    static generate = (fm: FishModel): FishModel => {
        const regenCount = fm.fish[0]
        const newFish = Array.from({ length: 9 }, (_, i) => match(i) 
            .with(6, _ => fm.fish[7] + regenCount)
            .with(8, _ => regenCount)
            .otherwise(_ => fm.fish[i + 1])
        )
        return new FishModel(newFish)
    }

    static count = (fm: FishModel) => pipe(fm.fish, concatAll(NumSum))
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
    console.log(answer)
}

main()
