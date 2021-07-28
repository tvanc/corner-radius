import CommandInterface from "./CommandInterface"

export default abstract class AbstractCommand implements CommandInterface {
  abstract getCommandLetter(): string
  abstract getParameters(): any[]

  toString(): string {
    return [this.getCommandLetter(), ...this.getParameters()].join(" ")
  }
}
