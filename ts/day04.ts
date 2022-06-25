import { number } from "fp-ts"
import { pipe } from "fp-ts/function"
import { MonoidAll, MonoidAny } from "fp-ts/boolean"
import { MonoidSum as NumSum, Eq as NumEq } from "fp-ts/number"
import { concatAll } from "fp-ts/Monoid"
import * as Opt from "fp-ts/Option"
import * as ROArray from "fp-ts/ReadonlyArray"

import { readLines, ROArrayUtil } from "./aoclib"

type Vector = ReadonlyArray<[number, boolean]>

module Vector {
    export const wins = (v: Vector): boolean => pipe(v, ROArray.every(x => x[1]))
    
    export const unmarkedSum = (v: Vector): number => pipe(
        v, 
        ROArray.map(v => v[1] ? 0 : v[0]),
        concatAll(NumSum)
    )
}

class Board {
    private constructor(private board: ReadonlyArray<Vector>) {}

    static row = (n: number) => (b: Board): Vector => b.board[n]

    static column = (n: number) => (b: Board): Vector => pipe(
        b.board,
        ROArray.map(r => r[n])
    )

    static wins = (b: Board): boolean => pipe(
        [0, 1, 2, 3, 4],
        ROArray.chain(n => [
            pipe(b, Board.row(n), Vector.wins),
            pipe(b, Board.column(n), Vector.wins)
        ]),
        concatAll(MonoidAny)
    )
    
    static playNumber = (n: number) => (b: Board): Board => pipe(
        b.board,
        ROArray.map(ROArray.map((s): [number, boolean] => [s[0], s[1] ? true : s[0] === n])),
        newB => new Board(newB)
    )
    
    static unmarkedSum = (b: Board): number => pipe(
        b.board,
        ROArray.map(Vector.unmarkedSum),
        concatAll(NumSum)
    )

    static fromArray = (a: ReadonlyArray<ReadonlyArray<number>>): Board => {
        if (!ROArray.getEq(NumEq).equals(a.map(j => j.length), [5, 5, 5, 5, 5])) {
            throw new Error(`bad board ${a.map(j => j.length)}`)
        } else {
            return pipe(
                a, 
                ROArray.map(ROArray.map((v): [number, boolean] => [v, false])),
                b => new Board(b)
            )
        }
    }
}

const readBoard = (lines: readonly string[]): Board => pipe(
    lines,
    ROArray.filter(l => l !== ""),
    ROArray.map(line => pipe(
        line.split(" "),
        ROArray.filter(v => v !== ""),
        ROArray.map(v => parseInt(v))
    )),
    Board.fromArray,
)

const readBoards = (lines: readonly string[]): readonly Board[] => pipe(
    lines,
    ROArrayUtil.group(line => line === ""),
    ROArray.map(readBoard)
)

type Input = {
    numbers: readonly number[]
    boards: readonly Board[]
}

const readInput = (): Input => {
    const lines = readLines();
    const numbers = lines[0].split(",").map(n => parseInt(n, 10))
    const boards = readBoards(lines.slice(2))
    return { numbers, boards }
}

const findWinner = (numbers: readonly number[], boards: readonly Board[]): [Board, number] => pipe(
    numbers,
    ROArray.matchLeft(
        () => { 
            throw new Error("no winner") },
        (n, newNumbers) => {
            const newBoards = pipe(boards, ROArray.map(Board.playNumber(n)));
            return pipe(
                newBoards,
                ROArray.findFirst(Board.wins),
                Opt.match(
                    () => findWinner(newNumbers, newBoards),
                    board => [board, n]
                )
            )
        }
    )
)

const main = () => {
    const input = readInput();
    const winner = findWinner(input.numbers, input.boards);
    const answer = Board.unmarkedSum(winner[0]) * winner[1];
    console.log(answer);
}

main()