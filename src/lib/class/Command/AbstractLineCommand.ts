import AbstractCommand from "./AbstractCommand"

export default abstract class AbstractLineCommand extends AbstractCommand {
  x: number
  y: number

  constructor(x: number, y: number) {
    super()

    this.x = x
    this.y = y
  }

  getParameters(): any[] {
    return [this.x, this.y]
  }
}
