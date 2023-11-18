import {
  getAdjacentLength,
  getAngle,
  getNextPoint,
  getOffset,
  getOppositeLength,
  getPreviousPoint,
  getTangentNoHyp,
  shortestLength,
} from "./utils.js"

import Point from "../../gpc/geometry/Point"
import MoveTo from "../class/Command/MoveTo"
import LineTo from "../class/Command/LineTo"
import Arc from "../class/Command/Arc"
import Close from "../class/Command/Close"

/**
 * Iterates through an array of normalised commands and insert arcs where applicable.
 * This function modifies the array in place.
 * @param {array} points Array with commands to be modified
 * @param {number} r Expected radius of the arcs.
 * @param {number} [offsetX]
 * @param {number} [offsetY]
 * @returns {array} Sequence of commands containing arcs in place of corners
 */
export function roundPathFromPoints(points, r, offsetX = 0, offsetY = 0) {
  const commands = []
  points
    .map(
      (el) =>
        new Point(
          parseFloat((el.x + offsetX).toFixed(2)),
          parseFloat((el.y + offsetY).toFixed(2)),
        ),
    )
    .map((el, i, arr) => {
      const largeArcFlag = false
      const prev = getPreviousPoint(i, arr)
      const next = getNextPoint(i, arr)
      const anglePrv = getAngle(el, prev)
      const angleNxt = getAngle(el, next)
      const angle = angleNxt - anglePrv // radians
      const degrees = angle * (180 / Math.PI)

      // prevent arc crossing the next command
      const shortest = shortestLength(el, prev, next)
      const maxRadius = Math.abs(getTangentNoHyp(angle / 2, shortest / 2))
      const radius = Math.min(r, maxRadius)

      const { offset, sweepFlag } = getOffset(angle, radius)

      const prevPoint = [
        el.x + getOppositeLength(anglePrv, offset),
        el.y + getAdjacentLength(anglePrv, offset),
      ]

      const nextPoint = [
        el.x + getOppositeLength(angleNxt, offset),
        el.y + getAdjacentLength(angleNxt, offset),
      ]

      const linePoint = new Point(
        parseFloat(prevPoint[0].toFixed(3)),
        parseFloat(prevPoint[1].toFixed(3)),
      )

      const arcPoint = new Point(
        parseFloat(nextPoint[0].toFixed(3)),
        parseFloat(nextPoint[1].toFixed(3)),
      )

      // there only need be a curve if and only if the next marker is a corner
      if (i === 0) {
        commands.push(new MoveTo(linePoint))
      } else {
        commands.push(new LineTo(linePoint))
      }

      commands.push(
        new Arc(radius, radius, degrees, largeArcFlag, sweepFlag, arcPoint),
      )
    })

  commands.push(new Close())

  return commands
}
