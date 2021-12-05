let read_input () = CCIO.read_all stdin

let read_lines () = CCIO.read_lines_l stdin

let read_ints_exn () = 
  read_lines ()
  |> List.map int_of_string

let read_with_parser parser =
  read_input ()
  |> CCParse.parse_string_exn parser

let read_lines_with_parser parser =
  CCParse.(many (parser <* (skip (char '\n') <|> eoi)))
  |> read_with_parser

module Seq = struct
  let count pred seq =
    seq
    |> CCSeq.filter pred
    |> CCSeq.length
end


module Parsers = struct
  let positiveInt = CCParse.(
    chars_if is_num
    |> map int_of_string
  )
end