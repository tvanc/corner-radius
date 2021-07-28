import PolySimple from "../../../../gpc/geometry/PolySimple"
import { Path } from "../../Path"
import Point from "../../../../gpc/geometry/Point"
import RadialPathRounder from "../RadialPathRounder"

it("Rounds given positive numbers", () => {})

it("Does not round with negative numbers", () => {})

it("Has no effect given a radius of zero", () => {})

it("Does not exceed line lengths", () => {
  const lineLength = 10
  const rounder = new RadialPathRounder()
  const path = Path.fromPoly(
    new PolySimple([
      new Point(0, lineLength),
      new Point(0, 0),
      new Point(lineLength, 0),
    ]),
  )

  rounder.roundPath(path)
})
