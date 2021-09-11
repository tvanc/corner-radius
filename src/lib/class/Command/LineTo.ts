import AbstractLineCommand from "./AbstractLineCommand"

export default class LineTo extends AbstractLineCommand {
  getCommandLetter(): string {
    return "L"
  }
}
