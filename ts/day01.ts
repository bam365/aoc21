import * as ROArray from "fp-ts/ReadonlyArray"

import * as aoclib from "./aoclib"


const main = () => {
    const numbers = aoclib.readNumbers();
    if (numbers.length === 0) {
        console.log("Not enough numbers")
    } else {
        const answer = countIncreases(numbers[0], 0, ROArray.dropLeft(1)(numbers))
        console.log(answer)
    }
}

const countIncreases = (prevN: number, acc: number, xs: readonly number[]): number => {
    if (xs.length === 0) {
        return acc
    } else {
        const newAcc = xs[0] > prevN ? acc + 1 : acc;
        return countIncreases(xs[0], newAcc, ROArray.dropLeft(1)(xs))
    }
}

main()