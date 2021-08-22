import PolySimple from "../../../../gpc/geometry/PolySimple"
import { Path } from "../../Path"
import Point from "../../../../gpc/geometry/Point"
import RadialRounder from "../RadialRounder"
import CubicCurve from "../../Command/CubicCurve"
import MoveTo from "../../Command/MoveTo"
import LineTo from "../../Command/LineTo"
import Close from "../../Command/Close"

it("Rounds to given positive numbers", () => {
  const lineLength = 100
  const radius = 10

  const halfRadius = radius / 2
  const lineLengthMinusRadius = lineLength - radius
  const lineLengthMinusHalfRadius = lineLength - halfRadius

  const rounder = new RadialRounder()
  const squarePath = Path.fromPoints([
    new Point(0, 0),
    new Point(lineLength, 0),
    new Point(lineLength, lineLength),
    new Point(0, lineLength),
  ])

  const actualResult = rounder.roundPath(squarePath, radius)
  const expectedResult = new Path([
    // Move to start of top right rounded corner
    new MoveTo(new Point(lineLengthMinusRadius, 0)),
    // top right corner
    new CubicCurve(
      new Point(lineLengthMinusHalfRadius, 0),
      new Point(lineLength, halfRadius),
      new Point(lineLength, radius),
    ),
    // right side
    new LineTo(new Point(lineLength, lineLengthMinusRadius)),
    // bottom right corner
    new CubicCurve(
      new Point(lineLength, lineLengthMinusHalfRadius),
      new Point(lineLengthMinusHalfRadius, lineLength),
      new Point(lineLengthMinusRadius, lineLength),
    ),
    // bottom side
    new LineTo(new Point(radius, lineLength)),
    // bottom left corner
    new CubicCurve(
      new Point(halfRadius, lineLength),
      new Point(0, lineLengthMinusHalfRadius),
      new Point(0, lineLengthMinusRadius),
    ),
    // left side
    new LineTo(new Point(0, radius)),
    // top left corner
    new CubicCurve(
      new Point(0, halfRadius),
      new Point(halfRadius, 0),
      new Point(radius, 0),
    ),
    new Close(),
  ])

  console.log(expectedResult.toString())

  expect(actualResult).toEqual(expectedResult)
})

it("Has no effect given a radius of zero", () => {})

it("Does not exceed line lengths", () => {})
