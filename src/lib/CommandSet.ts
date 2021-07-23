export class CommandSet {
  public commands: string[][]

  constructor(commands: string[][]) {
    this.commands = commands
  }

  toString() {
    return this.commands
      .reduce((str, c) => str + c.join(" ") + " ", "")
      .slice(0, -1)
  }
}
