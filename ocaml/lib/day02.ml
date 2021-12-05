module Command = struct
  type t =
    | Forward of int 
    | Up of int
    | Down of int

  let parse = 
    let open CCParse in
    let parse_command cmd_str f = 
      string cmd_str *> skip_white *> Aoccore.Parsers.positiveInt
      |> map f
    in 
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

module ShipStatePt2 = struct
  type t = 
    { horizontal_pos: int
    ; depth: int
    ; aim: int
    }

  let beginning = { horizontal_pos = 0; depth = 0; aim = 0 }

  let run_command t = function
    | Command.Forward(i) -> 
      { t with horizontal_pos = t.horizontal_pos + i;  depth = t.depth + (t.aim * i) }
    | Command.Down(i) -> { t with aim = t.aim + i }
    | Command.Up(i) -> { t with aim = t.aim - i }
end

let main () = 
  let commands = Aoccore.read_lines_with_parser Command.parse in
  CCList.fold_left ShipState.run_command ShipState.beginning commands
  |> fun state -> Printf.printf "pt1: %d\n" (state.horizontal_pos * state.depth);
  CCList.fold_left ShipStatePt2.run_command ShipStatePt2.beginning commands
  |> fun state -> Printf.printf "pt2: %d\n" (state.horizontal_pos * state.depth)