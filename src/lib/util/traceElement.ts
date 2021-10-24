import { getPaths } from "../draw"
import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import ArcRounder from "../class/PathRounder/ArcRounder"

const svgNs = "http://www.w3.org/2000/svg"
const svgElMap = new WeakMap()
const rounder = new ArcRounder()

export function traceElement(el: HTMLElement) {
  const svg = getSvg(el)

  const allPaths = svg.querySelectorAll("path")
  const unionPolygon = getUnionOfAllPolygons(el)
  const { x, y, w, h } = unionPolygon.getBounds()
  const style = getComputedStyle(el)
  const cornerRadius = parseFloat(style.getPropertyValue("border-radius"))

  unionPolygon.removeUnnecessaryPoints()

  const paths = getPaths(x, y, unionPolygon)

  for (let i = 0; i < paths.length; ++i) {
    const roundedPath = rounder.roundPath(paths[i], cornerRadius)
    // reuse existing path if available
    const path = allPaths[i] ?? document.createElementNS(svgNs, "path")

    path.setAttribute("d", roundedPath.toString())
    svg.appendChild(path)
  }

  for (let i = allPaths.length; i > paths.length; --i) {
    allPaths[i - 1].remove()
  }

  svg.setAttribute("width", w)
  svg.setAttribute("height", h)
  svg.style.top = `${y}px`
  svg.style.left = `${x}px`
}

function getUnionOfAllPolygons(root: HTMLElement): PolygonInterface {
  let polygon = getPolygon(root)

  ;[...root.children].forEach((leaf) => {
    polygon = polygon.union(getUnionOfAllPolygons(leaf as HTMLElement))
  })

  return polygon
}

function getPolygon(el): PolygonInterface {
  const rect = el.getBoundingClientRect()
  const polygon = new PolyDefault(false)

  const x1 = Math.round(rect.x)
  const y1 = Math.round(rect.y)
  const x2 = Math.round(rect.x + rect.width)
  const y2 = Math.round(rect.y + rect.height)

  polygon.add([
    [x1, y1],
    [x2, y1],
    [x2, y2],
    [x1, y2],
  ])

  return polygon
}

export function getSvg(el) {
  if (!svgElMap.has(el)) {
    const doc = el.ownerDocument
    const svg = doc.createElementNS(svgNs, "svg")

    svg.style.position = "absolute"

    doc.body.appendChild(svg)

    svgElMap.set(el, svg)
  }

  return svgElMap.get(el)
}
