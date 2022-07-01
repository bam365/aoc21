/* a functional solution that's really nice but space inefficient */
import { pipe } from "fp-ts/function"
import * as ROArray from "fp-ts/ReadonlyArray"

import { modifyN, readLines } from "./aoclib"


const generate = (xs: ReadonlyArray<number>): ReadonlyArray<number> => pipe(
    xs,
    ROArray.chain(v => v > 0 ? [v - 1] : [8, 6])
)

export const readInput = (): ReadonlyArray<number> => {
    const input = readLines()[0]
    return pipe(
        input.split(","),
        ROArray.filter(l => l !== ""),
        ROArray.map(v => parseInt(v))
    )
}

const main = () => {
    const answer = pipe(
        readInput(),
        modifyN(80, generate),
        ROArray.size
    )
    console.log(answer)
}

main()
