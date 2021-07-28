import AbstractCommand from "./AbstractCommand"

export default class Close extends AbstractCommand {
  getCommandLetter(): string {
    return "Z"
  }

  getParameters(): any[] {
    return []
  }
}
