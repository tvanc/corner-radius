import Point from "../class/Point"
import Edge from "../class/Edge"
import { edgesMatch, getEdges, getPolygonPaths } from "../getPolygons"
import Rectangle from "../class/Rectangle"

describe("edgesMatch()", () => {
  const start = new Point(0, 0)
  const end = new Point(100, 0)

  test("Identical edges match", () => {
    const edge1 = new Edge(start, end)
    const edge2 = new Edge(start, end)
    expect(edgesMatch(edge1, edge2)).toBe(true)
  })

  test("Reversed edges match", () => {
    const edge1 = new Edge(start, end)
    const edge2 = new Edge(end, start)
    expect(edgesMatch(edge1, edge2)).toBe(true)
  })

  test("Unique edges do not match", () => {
    const edge1 = new Edge(new Point(0, 0), new Point(100, 0))
    const edge2 = new Edge(new Point(50, 0), new Point(150, 0))
    expect(edgesMatch(edge1, edge2)).toBe(false)
  })
})

test("getEdges()", () => {
  const r1 = new Rectangle(new Point(0, 0), new Point(100, 100))
  const r2 = new Rectangle(new Point(100, 100), new Point(200, 200))
  const rectangles = [r1, r2]
  const edgesPerRectangle = 4

  const r1Edges = getEdges([r1])
  const allEdges = getEdges(rectangles)

  expect(r1Edges.length).toStrictEqual(edgesPerRectangle)
  expect(r1Edges).toContainEqual(new Edge(r1.topLeft, r1.topRight))
  expect(r1Edges).toContainEqual(new Edge(r1.topRight, r1.bottomRight))
  expect(r1Edges).toContainEqual(new Edge(r1.bottomRight, r1.bottomLeft))
  expect(r1Edges).toContainEqual(new Edge(r1.bottomLeft, r1.topLeft))

  expect(allEdges.length).toStrictEqual(edgesPerRectangle * rectangles.length)
})

test("getPolygonPaths()", function () {
  // ┌─────┬─────┐
  // │  0  ╎  1  │
  // ├╌╌╌╌╌┼─────┘
  // │  2  │
  // └─────┘
  const rectangles = [
    new Rectangle(new Point(0, 0), new Point(100, 100)),
    new Rectangle(new Point(100, 0), new Point(200, 100)),
    new Rectangle(new Point(0, 100), new Point(100, 200)),
  ]

  const uniqueEdges = getPolygonPaths(rectangles)
  const edgesPerRectangle = 4
  const sharedEdges = (rectangles.length - 1) * 2

  expect(uniqueEdges).toStrictEqual([
    new Point(0, 0),
    new Point(200, 0),
    new Point(200, 100),
    new Point(100, 100),
    new Point(100, 200),
    new Point(0, 200),
  ])
})
