/* a functional solution that's really nice but space inefficient */
import { pipe } from "fp-ts/function"
import * as ROArray from "fp-ts/ReadonlyArray"

import { readLines } from "./aoclib"


const generate = (xs: ReadonlyArray<number>): ReadonlyArray<number> => pipe(
    xs,
    ROArray.chain(v => v > 0 ? [v - 1] : [8, 6])
)

const generateN = (n: number) => (xs: ReadonlyArray<number>): ReadonlyArray<number> => 
    n <= 0 ? xs : generateN(n - 1)(generate(xs))

const readInput = (): ReadonlyArray<number> => {
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
        generateN(80),
        ROArray.size
    )
    console.log(answer)
}

main()
