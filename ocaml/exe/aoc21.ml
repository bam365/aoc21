let () = 
  match Sys.argv.(1) with
  | "1" -> Aoclib.Day01.main ()
  | _ -> print_endline "No solution for that day"