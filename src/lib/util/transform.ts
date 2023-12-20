import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import Transformer from "../class/Transformer"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import Point from "../../gpc/geometry/Point"
import Scale from "../../gpc/geometry/Scale"
import { Path } from "../class/Path"
import PolySimple from "../../gpc/geometry/PolySimple"

export function rotatePolygon(
  p: PolygonInterface,
  t: Transformer,
): PolygonInterface {
  const rotated = new PolyDefault(false)
  rotated.add(p.getPoints().map((p) => rotatePoint(p, t.rotation, t.origin)))
  return rotated
}

export function rotatePoint(point, angle, hub) {
  const dx = point.x - hub.x
  const dy = point.y - hub.y
  const fromAngle = Math.atan2(dy, dx)
  const toAngle = fromAngle + angle
  const radius = Math.hypot(dx, dy)
  const x = hub.x + radius * Math.cos(toAngle)
  const y = hub.y + radius * Math.sin(toAngle)
  return new Point(x, y)
}

export function scalePolygon(p: PolygonInterface, t: Transformer): PolyDefault {
  const scaled = new PolyDefault(false)
  scaled.add(p.getPoints().map((p) => scalePoint(p, t.scale, t.origin)))
  return scaled
}

export function scalePoint(point: Point, scale: Scale, origin: Point) {
  //           subtract origin   ->   scale  -> add origin
  const newX = (point.x - origin.x) * scale.x + origin.x
  const newY = (point.y - origin.y) * scale.y + origin.y
  return new Point(newX, newY)
}

export function translatePoint(
  point: Point,
  translateX: number,
  translateY: number,
) {
  return new Point(point.x + translateX, point.y + translateY)
}

export function translatePolygon(
  p: PolygonInterface,
  translateX: number,
  translateY: number,
) {
  const translated = new PolyDefault(false)
  translated.add(
    p.getPoints().map((p) => translatePoint(p, translateX, translateY)),
  )
  return translated
}

export function transform(el, polygon, transformer): PolyDefault {
  if (0 === polygon.getNumPoints()) {
    return undefined
  }

  const styles = getComputedStyle(el)
  const scaleValue = styles.scale
  const scaleArr =
    scaleValue === "none" ? [1, 1] : scaleValue.split(" ").map(parseFloat)
  const scale = transformer.scale

  const rotationDegrees = (parseFloat(styles.rotate) || 0) % 360
  const rotationRadians = (rotationDegrees * Math.PI) / 180
  const transformOriginValue = styles.transformOrigin.split(" ")

  // transform the new hub around the old
  let newOrigin = new Point(...transformOriginValue.map(parseFloat))

  if (transformer.origin) {
    const rotatedOrigin = rotatePoint(
      newOrigin,
      transformer.rotation,
      transformer.origin,
    )

    polygon = translatePolygon(
      polygon,
      newOrigin.x + rotatedOrigin.x,
      newOrigin.y + rotatedOrigin.y,
    )

    newOrigin = rotatedOrigin
  }

  transformer.origin = newOrigin

  scale.x *= scaleArr[0]
  scale.y *= scaleArr[1] ?? scaleArr[0]
  transformer.rotation += rotationRadians

  polygon = rotatePolygon(polygon, transformer)
  // polygon = scalePolygon(polygon, transformer)

  return smoothPoints(polygon)
}

function smoothPoints(originalPolygon: PolySimple) {
  const newPolygon = new PolyDefault()

  for (const point of originalPolygon.getPoints()) {
    newPolygon.addPoint(
      new Point(point.x.toFixed(3) * 1, point.y.toFixed(3) * 1),
    )
  }

  return newPolygon
}
