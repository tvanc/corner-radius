import CommandInterface from "./CommandInterface"

export default abstract class AbstractCommand implements CommandInterface {
  abstract getCommandLetter(): string

  /**
   * Returns the parameters used when rendering the command to a string,
   * or when cloning the command.
   */
  abstract getParameters(): any[]

  toString(): string {
    return [
      this.getCommandLetter(),
      ...this.getParameters().map((p) => (typeof p === "boolean" ? +p : p)),
    ].join(" ")
  }

  clone(): this {
    // @ts-ignore
    return new this.constructor(...this.getParameters())
  }
}
