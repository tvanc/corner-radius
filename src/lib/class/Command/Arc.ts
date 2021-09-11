import AbstractCommand from "./AbstractCommand"
import CommandWithEndpointInterface from "./CommandWithEndpointInterface"
import Point from "../../../gpc/geometry/Point"

class Arc extends AbstractCommand implements CommandWithEndpointInterface {
  constructor(
    public xRadius: number,
    public yRadius: number,
    public rotationInDegrees: number,
    public largeArc: boolean,
    public sweep: boolean,
    public endPoint: Point,
  ) {
    super()
  }

  getCommandLetter(): string {
    return "A"
  }

  getParameters(): any[] {
    return [
      this.xRadius,
      this.yRadius,
      this.rotationInDegrees,
      this.largeArc,
      this.sweep,
      this.endPoint,
    ]
  }
}
