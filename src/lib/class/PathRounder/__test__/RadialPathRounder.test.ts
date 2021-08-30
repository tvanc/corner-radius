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

  expect(actualResult).toEqual(expectedResult)
})

it("Gracefully handles corners shorter than given radius", () => {
  const horizontalLineLength = 20
  const verticalLineLength = 10
  const givenRadius = horizontalLineLength
  const expectedRadius = verticalLineLength / 2
  const halfExpectedRadius = expectedRadius / 2

  const startX = 0
  const startY = 0

  // Path looks like this, is rectilinear
  // -------|
  //        |-------
  const midX = startX + horizontalLineLength
  const midY = startY + verticalLineLength / 2
  const endX = startX + horizontalLineLength * 2
  const endY = startY + verticalLineLength

  const rounder = new RadialRounder()
  const startPath = Path.fromPoints([
    new Point(startX, startY),
    new Point(midX, startY),
    new Point(midX, endY),
    new Point(endX, endY),
  ])

  const expectedResultPath = new Path([
    new MoveTo(new Point(startX, startY)),
    new LineTo(new Point(midX - expectedRadius, startY)),
    new CubicCurve(
      new Point(midX - halfExpectedRadius, startY),
      new Point(midX, startY + halfExpectedRadius),
      new Point(midX, midY),
    ),
    new CubicCurve(
      new Point(midX, midY + halfExpectedRadius),
      new Point(midX + halfExpectedRadius, endY),
      new Point(midX + expectedRadius, endY),
    ),
    new LineTo(new Point(endX, endY)),
  ])

  // Remove close command
  startPath.commands.pop()

  const actualResultPath = rounder.roundPath(startPath, givenRadius)

  console.log("Original path", startPath.toString())
  console.log("Rounded path", actualResultPath.toString())
  console.log("expected path", expectedResultPath.toString())

  expect(actualResultPath.toString()).toBe(expectedResultPath.toString())
})
