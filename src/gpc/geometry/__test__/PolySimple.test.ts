import PolySimple from "../PolySimple"
import Point from "../Point"

it("Preserves final point if a vertex", () => {
  // Describes a square with the bottom left corner clipped, from bottom middle to middle left
  const clippedSquare = new PolySimple([
    new Point(0, 0), // top left,
    new Point(1, 0), // top middle   - redundant
    new Point(2, 0), // top right
    new Point(2, 1), // middle right - redundant
    new Point(2, 2), // bottom right
    new Point(1, 2), // bottom middle
    new Point(0, 1), // left middle
  ])

  clippedSquare.removeUnnecessaryPoints()

  expect(clippedSquare.getPoints()).toEqual([
    new Point(0, 0), // top left,
    new Point(2, 0), // top right
    new Point(2, 2), // bottom right
    new Point(1, 2), // bottom middle
    new Point(0, 1), // left middle
  ])
})

it("Removes final point if not a vertex", () => {
  // prettier-ignore
  const square = new PolySimple([
    new Point(0, 0),     // top left
    new Point(192, 0),   // top right
    new Point(192, 8),   // right - redundant
    new Point(192, 42),  // right - redundant
    new Point(192, 76),  // right - redundant
    new Point(192, 110), // right - redundant
    new Point(192, 152), // bottom right
    new Point(0, 152),   // bottom left
    new Point(0, 144),   // left - redundant
    new Point(0, 110),   // left - redundant
    new Point(0, 76),    // left - redundant
    new Point(0, 42),    // left - redundant
    new Point(0, 8),     // left - redundant
  ])

  square.removeUnnecessaryPoints()

  // prettier-ignore
  expect(square.getPoints()).toEqual([
    new Point(0, 0),     // top left
    new Point(192, 0),   // top right
    new Point(192, 152), // bottom right
    new Point(0, 152),   // bottom left
  ])
})

it("Removes redundant points from non-rectilinear polygons", () => {
  // describes a triangle pointing upward, with 45° slopes and a flat, 4-wide base
  const triangle = new PolySimple([
    new Point(2, 0), // top vertex
    new Point(3, 1), // middle right - redundant
    new Point(4, 2), // bottom right corner
    new Point(3, 2), // bottom       - redundant
    new Point(2, 2), // bottom       - redundant
    new Point(1, 2), // bottom       - redundant
    new Point(0, 2), // bottom left corner
  ])

  triangle.removeUnnecessaryPoints()

  expect(triangle.getPoints()).toEqual([
    new Point(2, 0),
    new Point(4, 2),
    new Point(0, 2),
  ])
})
