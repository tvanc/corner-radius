import PolySimple from "../PolySimple"
import Point from "../Point"

it("Removes unnecessary points from square", () => {
  const poly = new PolySimple([
    new Point(0, 0),
    new Point(1, 0), // can be eliminated
    new Point(2, 0),
    new Point(2, 1), // can be eliminated
    new Point(2, 2),
    new Point(1, 2), // can be eliminated
    new Point(0, 1),
  ])

  poly.removeUnnecessaryPoints()

  expect(poly.getPoints()).toEqual([
    new Point(0, 0),
    new Point(2, 0),
    new Point(2, 2),
    new Point(0, 1),
  ])
})

it("Removes unnecessary points from triangle", () => {
  const poly = new PolySimple([
    new Point(2, 0),
    new Point(3, 1), // can be eliminated
    new Point(4, 2),
    new Point(3, 2), // can be eliminated
    new Point(2, 2), // can be eliminated
    new Point(1, 2), // can be eliminated
    new Point(0, 2),
  ])

  poly.removeUnnecessaryPoints()

  expect(poly.getPoints()).toEqual([
    new Point(2, 0),
    new Point(4, 2),
    new Point(0, 2),
  ])
})
