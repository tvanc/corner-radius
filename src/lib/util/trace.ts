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
  rotationRadians = 0,
  previousHub: Point = undefined,
): PolygonInterface {
  const originalPolygon = new PolyDefault(false)
  originalPolygon.add(getPolygon(root, origin))
  const topLeft = originalPolygon.getPoint(0)

  if (!topLeft) {
    return undefined
  }

  const style = getComputedStyle(root)
  const rotationDegrees = (parseFloat(style.rotate) || 0) % 360
  const transformOriginValue = style.transformOrigin.split(" ")
  const originalHub = new Point(...transformOriginValue.map(parseFloat))

  originalHub.x += topLeft.x
  originalHub.y += topLeft.y

  rotationRadians += (rotationDegrees * Math.PI) / 180
  let polygon = rotationDegrees
    ? rotatePolygon(originalPolygon, rotationRadians, originalHub)
    : originalPolygon

  for (const leaf of (root.children as unknown) as HTMLElement[]) {
    const polyToAdd = getPolygons(leaf, origin, rotationRadians)
    if (polyToAdd) {
      polygon = polygon.union(polyToAdd)
    }
  }

  return polygon
}

function getPolygon(el, origin): PolySimple {
  const polygon = new PolySimple()

  // getBoundingClientRect() gets box AFTER rotation
  const originalRect = getRect(el)
  const scaleValue = getComputedStyle(el).scale
  const scale =
    scaleValue === "none" ? [1, 1] : scaleValue.split(" ").map(parseFloat)

  originalRect.width *= scale[0]
  originalRect.height *= scale[1]

  if (originalRect.width && originalRect.height) {
    const oX = Math.round(origin.x)
    const oY = Math.round(origin.y)

    const x1 = Math.round(originalRect.x)
    const y1 = Math.round(originalRect.y)
    const x2 = Math.round(originalRect.x + originalRect.width)
    const y2 = Math.round(originalRect.y + originalRect.height)
    polygon.add([
      new Point(x1 - oX, y1 - oY),
      new Point(x2 - oX, y1 - oY),
      new Point(x2 - oX, y2 - oY),
      new Point(x1 - oX, y2 - oY),
    ])
  }

  return polygon
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
