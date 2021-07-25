import PolySimple from "../PolySimple"
import Point from "../Point"

it("Removes unnecessary points from square", () => {
  const square = new PolySimple([
    new Point(0, 0),
    new Point(1, 0), // can be eliminated
    new Point(2, 0),
    new Point(2, 1), // can be eliminated
    new Point(2, 2),
    new Point(1, 2), // can be eliminated
    new Point(0, 1),
  ])

  square.removeUnnecessaryPoints()

  expect(square.getPoints()).toEqual([
    new Point(0, 0),
    new Point(2, 0),
    new Point(2, 2),
    new Point(1, 2),
    new Point(0, 1),
  ])
})

it("Removes final redundant point", () => {
  const square = new PolySimple([
    new Point(192, 152),
    new Point(0, 152),
    new Point(0, 144),
    new Point(0, 110),
    new Point(0, 76),
    new Point(0, 42),
    new Point(0, 8),
    new Point(0, 0),
    new Point(192, 0),
    new Point(192, 8),
    new Point(192, 42),
    new Point(192, 76),
    new Point(192, 110),
  ])

  square.removeUnnecessaryPoints()

  expect(square.getPoints()).toEqual([
    new Point(192, 152),
    new Point(0, 152),
    new Point(0, 0),
    new Point(192, 0),
  ])
})

it("Removes unnecessary points from triangle", () => {
  const triangle = new PolySimple([
    new Point(2, 0),
    new Point(3, 1), // can be eliminated
    new Point(4, 2),
    new Point(3, 2), // can be eliminated
    new Point(2, 2), // can be eliminated
    new Point(1, 2), // can be eliminated
    new Point(0, 2),
  ])

  triangle.removeUnnecessaryPoints()

  expect(triangle.getPoints()).toEqual([
    new Point(2, 0),
    new Point(4, 2),
    new Point(0, 2),
  ])
})
