import PathRounderInterface from "./PathRounderInterface"
import { Path } from "../Path"
import Point from "../../../gpc/geometry/Point"
import Arc from "../Command/Arc"
import { Vector } from "../../../gpc/geometry/Vector"

export default class Blindman67Rounder implements PathRounderInterface {
  roundPath(path: Path, radius: number): Path {
    return roundPathCorners(path, radius)
  }
}

function roundPathCorners(path: Path, radiusAll: number) {
  const len = path.length
  const commands = path.commands
  let resultCommands = []
  let lastPoint = pointForCommand(commands[len - 2])

  resultCommands.push(commands[0])
  let p1 = lastPoint
  let p2, p3
  // for each point
  for (let i = 0; i < len; i++) {
    p2 = pointForCommand(commands[i % len]) ?? lastPoint
    p3 = pointForCommand(commands[(i + 1) % len]) ?? lastPoint

    // Part 1
    const v1 = new Vector(p2, p1)
    const v2 = new Vector(p2, p3)
    const sinA = v1.nx * v2.ny - v1.ny * v2.nx
    const sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny
    let angle = Math.asin(sinA < -1 ? -1 : sinA > 1 ? 1 : sinA)
    let cRadius
    //-----------------------------------------
    let radDirection = 1
    let drawDirection = false
    if (sinA90 < 0) {
      if (angle < 0) {
        angle = Math.PI + angle
      } else {
        angle = Math.PI - angle
        radDirection = -1
        drawDirection = true
      }
    } else {
      if (angle > 0) {
        radDirection = -1
        drawDirection = true
      }
    }

    const radius = p2.radius !== undefined ? p2.radius : radiusAll

    // Part 2
    const halfAngle = angle / 2

    // Part 3
    let lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle))

    // Special part A
    if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
      lenOut = Math.min(v1.len / 2, v2.len / 2)
      cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle))
    } else {
      cRadius = radius
    }

    // Part 4
    let x = p2.x + v2.nx * lenOut
    let y = p2.y + v2.ny * lenOut

    // Part 5
    x += -v2.ny * cRadius * radDirection
    y += v2.nx * cRadius * radDirection

    // Part 6
    // TODO figure out how to convert end angle to end point
    const endPoint = new Point(x, y)
    resultCommands.push(new Arc(cRadius, cRadius, 0, false, drawDirection, endPoint))
    // ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection)

    //-----------------------------------------
    p1 = p2
    p2 = p3
  }

  return new Path(resultCommands)
}


// Gives an {x, y} object for a command's ending position
function pointForCommand(cmd): Point {
  return cmd.endPoint
}

function canvasToSvgArc () {

}

function arc(x1, y1, x2, y2, x3, y3, x4, y4) {
  let xRadius = Math.abs(x2 - x1) / 2;
  let yRadius = Math.abs(y2 - y1) / 2;
  let xCentre = Math.min(x1, x2) + xRadius;
  let yCentre = Math.min(y1, y2) + yRadius;

  // get intercepts relative to ellipse centre
  let startpt = interceptEllipseAndLine(xRadius, yRadius, x3 - xCentre, y3 - yCentre);
  let endpt = interceptEllipseAndLine(xRadius, yRadius, x4 - xCentre, y4 - yCentre);
  let largeArcFlag = isLargeArc(startpt, endpt) ? 1 : 0;

  return ['M', xCentre + startpt.x, yCentre + startpt.y,
    'A', xRadius, yRadius, 0, largeArcFlag, 0, xCentre + endpt.x, yCentre + endpt.y].join(' ');
}

// Finds the intercept of an ellipse and a line from centre to x0,y0
function interceptEllipseAndLine(xRadius, yRadius, x0, y0) {
  let den = Math.sqrt(xRadius * xRadius * y0 * y0 + yRadius * yRadius * x0 * x0);
  let mult = xRadius * yRadius / den;
  return { x: mult * x0, y: mult * y0 };
}

// Returns true if the angle between the two intercept lines is >= 180deg
function isLargeArc(start, end) {
  let angle = Math.atan2(start.x * end.y - start.y * end.x, start.x * end.x + start.y * end.y);
  return angle > 0;
}
