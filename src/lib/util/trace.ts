import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import Point from "../../gpc/geometry/Point"
import { roundPathFromPoints } from "../svg-round-corners"
import PolySimple from "../../gpc/geometry/PolySimple"
import Polygon from "../../gpc/geometry/Polygon"
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
    // el.style.clipPath = `path('${pathStrings[i]}')`
  }

  for (let i = allPaths.length; i > pathStrings.length; --i) {
    allPaths[i - 1].remove()
  }

  svg.setAttribute("width", w)
  svg.setAttribute("height", h)
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
  origin = new Point(0, 0),
): PolygonInterface {
  let polygon = new PolyDefault(false)
  polygon.add(getPolygon(root, origin))
  polygon = transform(polygon, getComputedStyle(root))
  ;[...root.children].forEach((leaf) => {
    polygon = polygon.union(getPolygons(leaf as HTMLElement, origin))
  })

  return polygon
}

function getPolygon(el, origin): PolySimple {
  const rect = getRect(el)

  const oX = Math.round(origin.x)
  const oY = Math.round(origin.y)

  const x1 = Math.round(rect.x)
  const y1 = Math.round(rect.y)
  const x2 = Math.round(rect.x + rect.width)
  const y2 = Math.round(rect.y + rect.height)

  return new PolySimple([
    new Point(x1 - oX, y1 - oY),
    new Point(x2 - oX, y1 - oY),
    new Point(x2 - oX, y2 - oY),
    new Point(x1 - oX, y2 - oY),
  ])
}

function getRect(el: HTMLElement) {
  const rect = {
    x: el.offsetLeft,
    y: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
  }

  while ((el = el.parentElement)) {
    rect.x += el.offsetLeft
    rect.y += el.offsetTop
  }

  return rect
}

function createPaths(
  complexPolygon: PolygonInterface,
  radius: number = 0,
): string[] {
  const num = complexPolygon.getNumInnerPoly()
  const paths = []

  for (let i = 0; i < num; i++) {
    const innerPoly = complexPolygon.getInnerPoly(i)
    const points = innerPoly.removeUnnecessaryPoints().getPoints()
    const path = roundPathFromPoints(points, radius).toString()

    paths.push(path)
  }

  return paths
}

function rotatePolygon(
  polygon: PolygonInterface,
  angle,
  hub,
): PolygonInterface {
  const rotated = new PolyDefault(false)

  // Rotate each vertex of the translated polygon
  rotated.add(polygon.getPoints().map((p) => rotatePoint(p, angle, hub)))

  return rotated
}

function rotatePoint(point, angle, hub) {
  const dx = point.x - hub.x
  const dy = point.y - hub.y
  const fromAngle = Math.atan2(dy, dx)
  const toAngle = fromAngle + angle
  const radius = Math.hypot(dx, dy)
  const x = hub.x + radius * Math.cos(toAngle)
  const y = hub.y + radius * Math.sin(toAngle)
  return new Point(x, y)
}

function skewPolygon(polygon, origin): PolyDefault {
  return polygon
}

function scalePolygon(polygon, x, y, origin): PolyDefault {
  return polygon
}

function transform(polygon, styles): PolyDefault {
  const scaleValue = styles.scale
  const scale =
    scaleValue === "none" ? [1, 1] : scaleValue.split(" ").map(parseFloat)

  const topLeft = polygon.getPoint(0)

  if (!topLeft) {
    return undefined
  }

  const rotationDegrees = (parseFloat(styles.rotate) || 0) % 360
  const rotationRadians = (rotationDegrees * Math.PI) / 180
  const transformOriginValue = styles.transformOrigin.split(" ")
  const hub = new Point(...transformOriginValue.map(parseFloat))

  hub.x += topLeft.x
  hub.y += topLeft.y

  polygon = rotatePolygon(polygon, rotationRadians, hub)
  polygon = scalePolygon(polygon, scale[0], scale[1], hub)

  return polygon
}
