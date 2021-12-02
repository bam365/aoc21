let read_ints_exn () = 
  stdin
  |> CCIO.read_lines_l
  |> List.map int_of_string
