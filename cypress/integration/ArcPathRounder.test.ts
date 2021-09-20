import { Path } from "../../src/lib/class/Path"
import Point from "../../src/gpc/geometry/Point"
import ArcRounder from "../../src/lib/class/PathRounder/ArcRounder"
import CubicCurve from "../../src/lib/class/Command/CubicCurve"
import MoveTo from "../../src/lib/class/Command/MoveTo"
import LineTo from "../../src/lib/class/Command/LineTo"
import Close from "../../src/lib/class/Command/Close"
import Arc from "../../src/lib/class/Command/Arc"

it("Rounds to given positive numbers", () => {
  const lineLength = 100
  const radius = 10

  const lengthMinusRadius = lineLength - radius

  const rounder = new ArcRounder()
  const squarePath = Path.fromPoints([
    new Point(0, 0),
    new Point(lineLength, 0),
    new Point(lineLength, lineLength),
    new Point(0, lineLength),
  ])

  const actualResult = rounder.roundPath(squarePath, radius)
  const expectedResult = new Path([
    // Move to start of top right rounded corner
    new MoveTo(new Point(lengthMinusRadius, 0)),
    // top right corner
    arcTo(radius, new Point(lineLength, radius)),
    // right side
    new LineTo(new Point(lineLength, lengthMinusRadius)),
    // bottom right corner
    arcTo(radius, new Point(lengthMinusRadius, lineLength)),
    // bottom side
    new LineTo(new Point(radius, lineLength)),
    // bottom left corner
    arcTo(radius, new Point(0, lengthMinusRadius)),
    // left side
    new LineTo(new Point(0, radius)),
    // top left corner
    arcTo(radius, new Point(radius, 0)),
    new Close(),
  ])

  expect(actualResult.toString()).to.be.equal(expectedResult.toString())
})

it("Gracefully handles corners shorter than given radius", () => {
  const horizontalLineLength = 20
  const verticalLineLength = 10
  const givenRadius = verticalLineLength
  const expectedRadius = verticalLineLength / 2
  const halfGivenRadius = givenRadius / 2

  const startX = 0
  const startY = 0

  // Path looks like this, is rectilinear
  // -------|
  //        |-------|
  //                |
  //                |
  const midX = startX + horizontalLineLength
  const firstY = startY + verticalLineLength / 2
  const endX = midX + horizontalLineLength
  const secondY = startY + verticalLineLength
  const thirdY = secondY + verticalLineLength * 2

  const rounder = new ArcRounder()
  const startPath = Path.fromPoints([
    // start point
    new Point(startX, startY),
    // top right of first ledge
    new Point(midX, startY),
    // start of second ledge
    new Point(midX, secondY),
    // top right of second ledge
    new Point(endX, secondY),
    // descender
    new Point(endX, thirdY),
  ])

  const startPathString = startPath.toString()
  const actualResultPath = rounder.roundPath(startPath, givenRadius)

  const expectedResultPath = new Path([
    new MoveTo(new Point(startX, startY)),
    new LineTo(new Point(midX - expectedRadius, startY)),
    // expect these two curves to have a smaller radius than the one given because the points are close together
    arcTo(halfGivenRadius, new Point(midX, firstY)),
    arcTo(halfGivenRadius, new Point(midX + expectedRadius, secondY)),
    new LineTo(new Point(endX - givenRadius, secondY)),
    //expect this curve to be match the radius given because there is plenty of room
    arcTo(givenRadius, new Point(endX, secondY + givenRadius)),
    new Close(),
  ])

  expect(startPath.toString()).to.be.equal(
    startPathString,
    "start path unchanged",
  )
  // It's easier to compare differences between strings
  expect(actualResultPath.toString()).to.be.equal(
    expectedResultPath.toString(),
    "result matches expectation",
  )
})

it("A square with oversized radius produces a circle", () => {
  const originX = 0
  const originY = 0
  const size = 8
  const endX = originX + size
  const endY = originY + size
  const givenRadius = size
  const expectedRadius = size / 2
  const expectedArcRotation = 0

  const halfSize = size / 2

  const vertices = [
    new Point(originX, originY),
    new Point(endX, originY),
    new Point(endX, endY),
    new Point(originX, endY),
  ]

  const closedStartPath = Path.fromPoints(vertices)
  const unclosedStartPath = Path.fromPoints(vertices)

  unclosedStartPath.unclose()

  const expectedClosedCommandList = [
    new MoveTo(new Point(originX + halfSize, originY)),
    // Arc
    // top-right "corner"
    new Arc(
      expectedRadius,
      expectedRadius,
      expectedArcRotation,
      false,
      true,
      new Point(endX, originY + halfSize),
    ),
    // bottom-right "corner"
    new Arc(
      expectedRadius,
      expectedRadius,
      expectedArcRotation,
      false,
      true,
      new Point(endX - halfSize, endY),
    ),
    // bottom-left "corner"
    new Arc(
      expectedRadius,
      expectedRadius,
      expectedArcRotation,
      false,
      true,
      new Point(originX, originX + halfSize),
    ),
    // top-left "corner"
    new Arc(
      expectedRadius,
      expectedRadius,
      expectedArcRotation,
      false,
      true,
      new Point(originX + halfSize, originY),
    ),
    new Close(),
  ]
  const expectedUnclosedCommandList = expectedClosedCommandList.slice(0, -1)

  const expectedClosedPath = new Path(expectedClosedCommandList)
  const expectedUnclosedPath = new Path(expectedUnclosedCommandList)

  const rounder = new ArcRounder()
  const actualClosedResult = rounder.roundPath(closedStartPath, givenRadius)
  const actualUnclosedResult = rounder.roundPath(unclosedStartPath, givenRadius)
  const actualClosedPathString = actualClosedResult.toString()
  const actualUnclosedPathString = actualUnclosedResult.toString()

  expect(actualClosedPathString).to.be.equal(expectedClosedPath.toString())
  expect(actualUnclosedPathString).to.be.equal(expectedUnclosedPath.toString())
})

function arcTo(radius: number, endpoint: Point, sweep: boolean = true): Arc {
  return new Arc(radius, radius, 0, false, sweep, endpoint)
}
