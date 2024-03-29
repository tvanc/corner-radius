import { Path } from "../../src/lib/class/Path"
import Point from "../../src/gpc/geometry/Point"
import ArcRounder from "../../src/lib/class/Rounder/ArcRounder"
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
  // M------L
  //        L-------L
  //                |
  //                L
  const midX = startX + horizontalLineLength
  const firstY = startY + verticalLineLength / 2
  const endX = midX + horizontalLineLength
  const secondY = startY + verticalLineLength
  const thirdY = secondY + verticalLineLength

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

  // first and last points remain the same when the path is unclosed
  startPath.unclose()

  const startPathString = startPath.toString()
  const actualResultPath = rounder.roundPath(startPath, givenRadius)

  const expectedResultPath = new Path([
    new MoveTo(new Point(startX, startY)),
    new LineTo(new Point(midX - expectedRadius, startY)),
    // expect these two curves to have a smaller radius than the one given because the points are close together
    arcTo(halfGivenRadius, new Point(midX, firstY)),
    arcTo(halfGivenRadius, new Point(midX + expectedRadius, secondY), false),
    new LineTo(new Point(endX - givenRadius, secondY)),
    //expect this curve to match the radius given because there is plenty of room
    arcTo(givenRadius, new Point(endX, thirdY)),
  ])

  expect(startPath.toString()).to.be.equal(
    startPathString,
    "start path unchanged",
  )

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

  const startPath = Path.fromPoints([
    new Point(originX, originY),
    new Point(endX, originY),
    new Point(endX, endY),
    new Point(originX, endY),
  ])

  const expectedPath = new Path([
    new MoveTo(new Point(originX + halfSize, originY)),
    // Arc
    // top-right "corner"
    arcTo(expectedRadius, new Point(endX, originY + halfSize)),
    // bottom-right "corner"
    arcTo(expectedRadius, new Point(endX - halfSize, endY)),
    // bottom-left "corner"
    arcTo(expectedRadius, new Point(originX, originX + halfSize)),
    // top-left "corner"
    arcTo(expectedRadius, new Point(originX + halfSize, originY)),
    new Close(),
  ])

  const rounder = new ArcRounder()
  const actualClosedResult = rounder.roundPath(startPath, givenRadius)
  expect(actualClosedResult.toString()).to.be.equal(expectedPath.toString())
})

function arcTo(radius: number, endpoint: Point, sweep: boolean = true): Arc {
  return new Arc(radius, radius, 0, false, sweep, endpoint)
}
