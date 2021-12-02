import { pipe } from "fp-ts/lib/function";
import * as ROArray from "fp-ts/ReadonlyArray"

import * as aoclib from "./aoclib"


const main = () => {
    const numbers = aoclib.readNumbers()
    const answer = pipe(
        numbers,
        ROArray.zip(ROArray.dropLeft(1)(numbers)),
        ROArray.filter(([a, b]) => a < b),
        ROArray.size
    )
    console.log(answer)
}

main()