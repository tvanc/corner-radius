import PolygonInterface from "../../gpc/geometry/PolygonInterface"
import Transformer from "../class/Transformer"
import PolyDefault from "../../gpc/geometry/PolyDefault"
import Point from "../../gpc/geometry/Point"
import Scale from "../../gpc/geometry/Scale"
import { Path } from "../class/Path"

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

export function transform(el, polygon, transformer): PolyDefault {
  const topLeft = polygon.getPoint(0)

  if (!topLeft) {
    return undefined
  }

  const styles = getComputedStyle(el)
  const scaleValue = styles.scale
  const scale =
    scaleValue === "none" ? [1, 1] : scaleValue.split(" ").map(parseFloat)

  const rotationDegrees = (parseFloat(styles.rotate) || 0) % 360
  const rotationRadians = (rotationDegrees * Math.PI) / 180
  const transformOriginValue = styles.transformOrigin.split(" ")

  // transform the new hub around the old
  let newOrigin = new Point(...transformOriginValue.map(parseFloat))

  if (scale[0] !== 1 || scale[1] !== 1 || rotationRadians) {
    if (transformer.origin) {
      newOrigin = rotatePoint(
        newOrigin,
        transformer.rotation,
        transformer.origin,
      )
      // newOrigin = scalePoint(newOrigin, transformer.scale, transformer.origin)
    }

    transformer.scale.x *= scale[0]
    transformer.scale.y *= scale[1] ?? scale[0]
    transformer.rotation += rotationRadians

    transformer.origin ??= newOrigin

    transformer.origin.x += newOrigin.x
    transformer.origin.y += newOrigin.y
  }

  newOrigin.x += topLeft.x
  newOrigin.y += topLeft.y

  if (el.id === "settingsMenu") {
    console.log("settingsMenu", Path.fromPoly(polygon).toString())
  }

  if (transformer.origin) {
    polygon = rotatePolygon(polygon, transformer)
    // polygon = scalePolygon(polygon, transformer)
  }

  return polygon
}
