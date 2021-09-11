export default interface CommandInterface {
  getCommandLetter(): string

  getParameters(): any[]

  toString(): string
}
