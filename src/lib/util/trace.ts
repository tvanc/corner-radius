import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import Point from "../../gpc/geometry/Point"
import PolySimple from "../../gpc/geometry/PolySimple"
import { roundPathFromPoints } from "../svg-round-corners"
import { Path } from "../class/Path"

const svgNs = "http://www.w3.org/2000/svg"
const svgElMap = new WeakMap()

export function trace(el: HTMLElement) {
  const svg = getSvg(el)
  const allPaths = svg.querySelectorAll("path")
  const origin = el.getBoundingClientRect()
  const unionPolygon = getPolygons(el, origin)
  const { w, h } = unionPolygon.getBounds()
  const style = getComputedStyle(el)
  const radius = parseFloat(style.getPropertyValue("border-radius"))
  const pathStrings = createPaths(unionPolygon, radius)

  for (let i = 0; i < pathStrings.length; ++i) {
    const pathEl = allPaths[i] ?? document.createElementNS(svgNs, "path")
    pathEl.setAttribute("d", pathStrings[i])
    svg.appendChild(pathEl)

    // TODO clip each child with a detached polygon separately
    el.style.clipPath = `path('${pathStrings[i]}')`
  }

  for (let i = allPaths.length; i > pathStrings.length; --i) {
    allPaths[i - 1].remove()
  }

  svg.setAttribute("width", w * 2 + "")
  svg.setAttribute("height", h * 2 + "")
  svg.style.top = `${origin.y}px`
  svg.style.left = `${origin.x}px`
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

function getPolygons(
  root: HTMLElement,
  origin: Point = new Point(0, 0),
): PolygonInterface {
  let polygon = getPolygon(root, origin)

  ;[...root.children].forEach((leaf) => {
    polygon = polygon.union(getPolygons(leaf as HTMLElement, origin))
  })

  return polygon
}

function getPolygon(el, origin): PolygonInterface {
  const rect = el.getBoundingClientRect()
  const polygon = new PolyDefault(false)

  const x1 = Math.round(rect.x)
  const y1 = Math.round(rect.y)
  const x2 = Math.round(rect.x + rect.width)
  const y2 = Math.round(rect.y + rect.height)

  polygon.add([
    [x1 - origin.x, y1 - origin.y],
    [x2 - origin.x, y1 - origin.y],
    [x2 - origin.x, y2 - origin.y],
    [x1 - origin.x, y2 - origin.y],
  ])

  return polygon
}

function createPaths(
  complexPolygon: PolygonInterface,
  radius: number = 0,
): string[] {
  const num = complexPolygon.getNumInnerPoly()
  const paths = []

  for (let i = 0; i < num; i++) {
    const innerPoly: PolySimple = complexPolygon.getInnerPoly(i)
    const points = [
      new Point(411.1875, 236.602294921875),
      new Point(123.1875, 236.602294921875),
      new Point(0.1875, 220.602294921875),
      new Point(0.1875, -0.397705078125),
      new Point(288.1875, -0.397705078125),
      new Point(288.1875, 165.602294921875),
      new Point(411.1875, 165.602294921875),
    ]
    const path = roundPathFromPoints(points, radius).toString()

    console.log("points", points)
    console.log("original path", Path.fromPoints(points).toString())
    console.log("rounded path", path)

    paths.push(path)
  }

  return paths
}
