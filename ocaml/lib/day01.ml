let rec count_increases last_n acc = function
  | []    -> acc
  | x::xs -> 
    let acc' = if x > last_n then acc + 1 else acc in
    count_increases x acc' xs
  
let main () = 
  match Aoccore.read_ints_exn () with
  | (x::xs) -> Printf.printf "%d\n" (count_increases x 0 xs)
  | []      -> print_endline "Not enough numbers"
  