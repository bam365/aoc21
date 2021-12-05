open Aoccore

let most_frequent pos fields = 
  let folder acc field = if (Bitfield.nth field pos) then acc + 1 else acc - 1 in
  CCList.fold_left folder 0 fields
  |> fun acc -> if acc < 0 then false else true

let calc_gamma fields =
  let rec loop max (acc: Bitfield.t) i =
    if i >= max then acc
    else loop max (Bitfield.append acc (most_frequent i fields)) (i + 1)
  in 
  let width = List.hd fields |> List.length in
  loop width [] 0

let main () = 
  let fields = read_lines_with_parser Bitfield.parser in
  let gamma = calc_gamma fields in
  let epsilon = Bitfield.compliment gamma in
  let answer = (Bitfield.to_int gamma) * (Bitfield.to_int epsilon) in
  Printf.printf "%d\n" answer
