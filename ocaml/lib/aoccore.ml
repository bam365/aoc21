let read_input () = CCIO.read_all stdin

let read_lines () = CCIO.read_lines_l stdin

let read_ints_exn () = 
  read_lines ()
  |> List.map int_of_string

let read_with_parser parser =
  read_input ()
  |> CCParse.parse_string_exn parser

let read_lines_with_parser parser =
  read_lines ()
  |> List.map (CCParse.parse_string_exn parser)

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


module Bitfield : sig 
  type t = bool list
  val empty : t
  val compliment : t -> t
  val to_int : t -> int
  val to_string : t -> string
  val append : t -> bool -> t
  val nth : t -> int -> bool
  val parser : t CCParse.t
end = struct
  type t = bool list

  let empty = []

  let compliment = CCList.map not

  let to_int t = 
    CCList.mapi (fun i bit -> if bit then CCInt.pow 2 i else 0) t
    |> CCList.fold_left (+) 0

  let to_string t =
    CCList.map (fun c -> if c then '1' else '0') t
    |> CCList.rev
    |> CCList.to_seq
    |> String.of_seq

  let nth = CCList.nth

  let append t v = t @ [v]

  let parser =
    let open CCParse in
    let bit_parser = 
      char '0' *> pure false
      <|> char '1' *> pure true
    in
    many bit_parser
    |> map CCList.rev
end