import AbstractLineCommand from "./AbstractLineCommand"

export default class MoveTo extends AbstractLineCommand {
  getCommandLetter(): string {
    return "M"
  }

  toString(): string {
    return
  }
}
