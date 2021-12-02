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