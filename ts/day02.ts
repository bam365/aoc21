import { pipe } from "fp-ts/function"
import * as ROArray from "fp-ts/ReadonlyArray"
import { match } from "ts-pattern"

import { readLines } from "./aoclib"


type Position = {
    horiz: number
    depth: number
}

type Direction = "forward" | "up" | "down"

type Movement = {
    direction: Direction
    amount: number
}

const applyMovement = (m: Movement) => (p: Position): Position => match(m.direction)
    .with("forward", () => ({ ...p, horiz: p.horiz + m.amount }))
    .with("up", () => ({ ...p, depth: p.depth - m.amount }))
    .with("down", () => ({ ...p, depth: p.depth + m.amount }))
    .exhaustive()

const applyMovements = (ms: ReadonlyArray<Movement>) => (p: Position): Position => pipe(
    ms,
    ROArray.reduce(p, (acc, v) => applyMovement(v)(acc))
)

const isDirection = (v: string): v is Direction => 
    v === "forward" || v === "up" || v === "down"

const parseMovement = (line: string): Movement => {
    const parts = line.split(/\s+/)
    const direction = parts[0]
    const amount = parseInt(parts[1])
    if (isDirection(direction) && !isNaN(amount)) {
        return { direction, amount }
    } else {
        throw new Error("Malformed movement input")
    }
}

const main = () => {
    const movements = pipe(
        readLines(),
        ROArray.filter(line => !line.match(/^\s*$/)),
        ROArray.map(parseMovement),
    )
    const answer = pipe(
        { horiz: 0, depth: 0},
        applyMovements(movements),
        ({ horiz, depth}) => horiz * depth
    )
    console.log(answer)
}

main()