import PolySimple from "../../../../gpc/geometry/PolySimple"
import { Path } from "../../Path"
import Point from "../../../../gpc/geometry/Point"
import RadialPathRounder from "../RadialPathRounder"
import CurveCommand from "../../Command/CubicCurve"

it("Rounds to given positive numbers", () => {
  const lineLength = 10
  const radius = 15
  const rounder = new RadialPathRounder()
  const path = Path.fromPoly(
    new PolySimple([
      new Point(0, lineLength),
      new Point(0, 0),
      new Point(lineLength, 0),
    ]),
  )

  const roundedPath = rounder.roundPath(path)
  expect(roundedPath).toBeInstanceOf(CurveCommand)
})

it("Does not round with negative numbers", () => {})

it("Has no effect given a radius of zero", () => {})

it("Does not exceed line lengths", () => {})
