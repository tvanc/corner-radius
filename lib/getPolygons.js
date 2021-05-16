import Edge from "./class/Edge"


export function getEdges (rectangles) {
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

export function edgesMatch (edgeA, edgeB) {
  return edgeB.start.x === edgeA.start.x && edgeB.start.y === edgeA.start.y
  && edgeB.end.x === edgeA.end.x && edgeB.end.y === edgeA.end.y
  || edgeB.start.x === edgeA.end.x && edgeB.start.y === edgeA.end.y
  && edgeB.end.x === edgeA.start.x && edgeB.end.y === edgeA.start.y
}
