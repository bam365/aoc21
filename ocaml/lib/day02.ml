module Command = struct
  type t =
    | Forward of int 
    | Up of int
    | Down of int

  let parse = 
    let open CCParse in
    let parse_command cmd_str f = CCParse.(
      string cmd_str *> skip_white *> Aoccore.Parsers.positiveInt
      |> map f
    ) in
    parse_command "forward" (fun i -> Forward(i))
    <|> parse_command "down" (fun i -> Down(i))
    <|> parse_command "up" (fun i -> Up(i)) 

end

module ShipState = struct 
  type t =  
    { horizontal_pos: int
    ; depth: int
    }

  let beginning = { horizontal_pos = 0; depth = 0 }

  let run_command { horizontal_pos; depth } = function
    | Command.Forward(i) -> { horizontal_pos = horizontal_pos + i; depth }
    | Command.Down(i) -> { horizontal_pos; depth = depth + i }
    | Command.Up(i) -> { horizontal_pos; depth = depth - i }
end

let main () = 
  Aoccore.read_lines_with_parser Command.parse
  |> CCList.fold_left ShipState.run_command ShipState.beginning
  |> fun state -> Printf.printf "%d\n" (state.horizontal_pos * state.depth)