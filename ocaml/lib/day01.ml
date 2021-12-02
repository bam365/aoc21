let main () =
  let numbers = Aoccore.read_ints_exn () in
  CCSeq.drop 1 (CCList.to_seq numbers)
  |> CCSeq.zip (CCList.to_seq numbers) 
  |> Aoccore.Seq.count (fun (a, b) -> a < b)
  |> Printf.printf "%d\n"
