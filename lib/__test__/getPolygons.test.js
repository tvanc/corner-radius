import Point from "../class/Point"
import Edge from "../class/Edge"
import { edgesMatch } from "../getPolygons"

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
