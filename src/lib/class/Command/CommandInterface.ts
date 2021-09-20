export default interface CommandInterface {
  getCommandLetter(): string

  clone(): this

  getParameters(): any[]

  toString(): string
}
