import Polygon from "./class/Polygon"
import Edge from "./class/Edge"

/**
 * @param {Rectangle[]} rectangles
 * @returns {Polygon[]}
 */
export function getPolygons(rectangles) {
  const allEdges = getEdges(rectangles)
  const uniqueEdges = getPolygons(allEdges)

  return [new Polygon(allEdges)]
}

/**
 * @param {Edge[]} edges
 */
export function getVertices(edges) {
  const vertices = []

  for (const edge of edges) {
  }
}

export function getEdges(rectangles) {
  const edges = []

  for (const { topLeft, topRight, bottomRight, bottomLeft } of rectangles) {
    edges.push(
      new Edge(topLeft, topRight),
      new Edge(topRight, bottomRight),
      new Edge(bottomRight, bottomLeft),
      new Edge(bottomLeft, topLeft),
    )
  }

  return edges
}

export function edgesMatch(edgeA, edgeB) {
  // prettier-ignore
  return (
    // Points match exactly
    edgeB.start.x === edgeA.start.x
    && edgeB.start.y === edgeA.start.y
    && edgeB.end.x === edgeA.end.x
    && edgeB.end.y === edgeA.end.y
    ||
    // Points are reversed, but equal
    edgeB.start.x === edgeA.end.x
    && edgeB.start.y === edgeA.end.y
    && edgeB.end.x === edgeA.start.x
    && edgeB.end.y === edgeA.start.y
  )
}

export function getPolygons(edges) {
  const result = [...edges]

  for (let i = result.length - 1; i >= 0; --i) {
    const edgeA = result[i]
    for (let j = result.length - 1; j > i; --j) {
      const edgeB = result[j]

      if (edgesMatch(edgeA, edgeB)) {
        result.splice(j, 1)
      }
    }
  }

  return result
}
