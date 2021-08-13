import PolySimple from "../../../../gpc/geometry/PolySimple"
import { Path } from "../../Path"
import Point from "../../../../gpc/geometry/Point"
import RadialPathRounder from "../RadialPathRounder"
import CubicCurve from "../../Command/CubicCurve"

it("Rounds to given positive numbers", () => {
  const lineLength = 10
  const radius = 5
  const rounder = new RadialPathRounder()
  const path = Path.fromPoly(
    new PolySimple([
      new Point(0, 0),
      new Point(lineLength, 0),
      new Point(lineLength, lineLength),
      new Point(0, lineLength),
    ]),
  )

  const roundedPath = rounder.roundPath(path, radius)
  expect(roundedPath).toBeInstanceOf(Path)
  expect(roundedPath.commands.some(c => c instanceof CubicCurve)).toBe(true)
})

it("Does not round with negative numbers", () => {})

it("Has no effect given a radius of zero", () => {})

it("Does not exceed line lengths", () => {})
