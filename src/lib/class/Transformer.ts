import Point from "../../gpc/geometry/Point"
import Scale from "../../gpc/geometry/Scale"

export default class Transformer {
  scale = new Scale(1, 1)
  rotation = 0

  constructor(public origin: Point = undefined) {}
}
