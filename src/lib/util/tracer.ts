import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import PathMaker from "../class/PathMaker"
import Point from "../../gpc/geometry/Point"

const svgNs = "http://www.w3.org/2000/svg"
const svgElMap = new WeakMap()

export function tracer(el: HTMLElement) {
  const svg = getSvg(el)

  const allPaths = svg.querySelectorAll("path")
  const origin = el.getBoundingClientRect()
  const unionPolygon = getPolygons(el, origin)
  const { w, h } = unionPolygon.getBounds()
  const style = getComputedStyle(el)
  const radius = parseFloat(style.getPropertyValue("border-radius"))
  const pathMaker = new PathMaker()
  const pathStrings = pathMaker.makePaths(unionPolygon, radius)

  for (let i = 0; i < pathStrings.length; ++i) {
    const pathEl = allPaths[i] ?? document.createElementNS(svgNs, "path")
    pathEl.setAttribute("d", pathStrings[i])
    svg.appendChild(pathEl)

    el.style.clipPath = `path('${pathStrings[i]}')`
  }

  for (let i = allPaths.length; i > pathStrings.length; --i) {
    allPaths[i - 1].remove()
  }

  svg.setAttribute("width", w)
  svg.setAttribute("height", h)
  svg.style.top = `${origin.y}px`
  svg.style.left = `${origin.x}px`
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
