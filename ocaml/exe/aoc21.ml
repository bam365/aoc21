let () = 
  match Sys.argv.(1) with
  | "1" -> Aoclib.Day01.main ()
  | "2" -> Aoclib.Day02.main ()
  | "3" -> Aoclib.Day03.main ()
  | _ -> print_endline "No solution for that day"