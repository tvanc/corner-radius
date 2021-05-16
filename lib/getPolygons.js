import Edge from "./class/Edge"

export function edgesMatch (edgeA, edgeB) {
  return edgeB.start.x === edgeA.start.x && edgeB.start.y === edgeA.start.y
  && edgeB.end.x === edgeA.end.x && edgeB.end.y === edgeA.end.y
  || edgeB.start.x === edgeA.end.x && edgeB.start.y === edgeA.end.y
  && edgeB.end.x === edgeA.start.x && edgeB.end.y === edgeA.start.y
}
