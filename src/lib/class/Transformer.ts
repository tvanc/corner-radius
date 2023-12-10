import Point from "../../gpc/geometry/Point"
import Scale from "../../gpc/geometry/Scale"

export default class Transformer {
  constructor(
    public origin: Point = undefined,
    public rotation = 0,
    public scale = new Scale(1, 1),
  ) {}
}
