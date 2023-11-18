import {
  commandsToSvgPath,
  convertToAbsolute,
  getAdjacentLength,
  getAngle,
  getNextNoZ,
  getNextPoint,
  getOffset,
  getOppositeLength,
  getPreviousNoZ,
  getPreviousPoint,
  getTangentNoHyp,
  markOverlapped,
  newCommands,
  reverseMarkOverlapped,
  roundValues,
  shortestLength,
  shortestSide,
} from "./utils.js"

import Point from "../../gpc/geometry/Point"
import MoveTo from "../class/Command/MoveTo"
import LineTo from "../class/Command/LineTo"
import Arc from "../class/Command/Arc"
import Close from "../class/Command/Close"

/**
 * Parses the given command string and generates an array of parsed commands.
 * This function normalises all relative commands into absolute commands and
 * transforms h, H, v, V to L commands
 * @param {string} str Raw string from 'd' Attribute
 * @returns {array} Array of normalised commands
 */
function parsePath(str) {
  const markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g
  const digitRegEx = /-?[0-9]*\.?\d+/g

  return [...str.matchAll(markerRegEx)]
    .map((match) => {
      return { marker: match[0], index: match.index }
    })
    .reduceRight((acc, cur) => {
      const chunk = str.substring(
        cur.index,
        acc.length ? acc[acc.length - 1].index : str.length,
      )
      return acc.concat([
        {
          marker: cur.marker,
          index: cur.index,
          chunk: chunk.length > 0 ? chunk.substr(1, chunk.length - 1) : chunk,
        },
      ])
    }, [])
    .reverse()
    .flatMap((cmd) => {
      const values = cmd.chunk.match(digitRegEx)
      const vals = values ? values.map(parseFloat) : []
      return newCommands(cmd.marker, vals)
    })
    .map(convertToAbsolute)
}

/**
 * Iterates through an array of normalised commands and insert arcs where applicable.
 * This function modifies the array in place.
 * @param {array} cmds Array with commands to be modified
 * @param {number} r Expected radius of the arcs.
 * @param {number} round Number of decimal digits to round values
 * @param {number} offsetX
 * @param {number} offsetY
 * @returns {string} Sequence of commands containing arcs in place of corners
 */
function roundCommands(cmds, r, round, offsetX, offsetY) {
  let subpaths = []
  let newCmds = []

  if (round) {
    cmds.forEach((el) => roundValues(el, round))
    // roundValues(cmds, round);
  }

  cmds
    // split sub paths
    .forEach((e) => {
      if (e.marker === "M") {
        subpaths.push([])
      }
      subpaths[subpaths.length - 1].push(e)
    })

  subpaths.forEach((subPathCmds) => {
    subPathCmds
      // We are only excluding lineTo commands that may be overlapping
      .map(markOverlapped)

    reverseMarkOverlapped(subPathCmds, subPathCmds.length - 1)

    // is this an open or closed path? don't add arcs to start/end.
    const closedPath = subPathCmds[subPathCmds.length - 1].marker === "Z"
    const adjustEndPoint = (cmd) => {
      if (cmd.values?.x !== undefined && cmd.values?.y !== undefined) {
        cmd.values.x += offsetX
        cmd.values.y += offsetY
      }

      return cmd
    }

    subPathCmds
      .filter((el) => !el.overlap)
      .map(adjustEndPoint)
      .map((el, i, arr) => {
        const largeArcFlag = 0
        const prev = getPreviousNoZ(el, i, arr)
        const next = getNextNoZ(el, i, arr)
        const anglePrv = getAngle(el.values, prev.values)
        const angleNxt = getAngle(el.values, next.values)
        const angle = angleNxt - anglePrv // radians
        const degrees = angle * (180 / Math.PI)
        // prevent arc crossing the next command
        const shortest = shortestSide(el, prev, next)
        const maxRadius = Math.abs(getTangentNoHyp(angle / 2, shortest / 2))
        const radius = Math.min(r, maxRadius)

        const o = getOffset(angle, radius)
        const offset = o.offset
        const sweepFlag = o.sweepFlag
        const openFirstOrLast = (i === 0 || i === arr.length - 1) && !closedPath

        switch (el.marker) {
          case "M": // moveTo x,y
          case "L": // lineTo x,y
            /* eslint-disable no-case-declarations */
            const prevPoint = [
              el.values.x + getOppositeLength(anglePrv, offset),
              el.values.y + getAdjacentLength(anglePrv, offset),
            ]

            /* eslint-disable no-case-declarations */
            const nextPoint = [
              el.values.x + getOppositeLength(angleNxt, offset),
              el.values.y + getAdjacentLength(angleNxt, offset),
            ]

            // there only need be a curve if and only if the next marker is a corner
            if (!openFirstOrLast) {
              newCmds.push({
                marker: el.marker,
                values: {
                  x: parseFloat(prevPoint[0].toFixed(3)),
                  y: parseFloat(prevPoint[1].toFixed(3)),
                },
              })
            } else {
              newCmds.push({
                marker: el.marker,
                values: el.values,
              })
            }

            if (
              !openFirstOrLast &&
              (next.marker === "L" || next.marker === "M")
            ) {
              newCmds.push({
                marker: "A",
                radius: radius,
                values: {
                  radiusX: radius,
                  radiusY: radius,
                  rotation: degrees,
                  largeArc: largeArcFlag,
                  sweep: sweepFlag,
                  x: parseFloat(nextPoint[0].toFixed(3)),
                  y: parseFloat(nextPoint[1].toFixed(3)),
                },
              })
            }
            break
          // case 'H': // horizontalTo x. Transformed to L in utils
          // case 'V': // verticalTo y. Transformed to L in utils
          case "C": // cubic beziér: x1 y1, x2 y2, x y
          case "S": // short beziér: x2 y2, x y
          case "Q": // quadratic beziér: x1 y1, x y
          case "T": // short quadratic beziér: x y
          case "A": // arc: rx ry x-axis-rotation large-arc-flag sweep-flag x y
          case "Z": // close path
            newCmds.push({ marker: el.marker, values: el.values })
            break
        }
      })
  })

  return commandsToSvgPath(newCmds)
}

/**
 * This is a shorthand for parsePath() and roundCommands().
 * You get the end result in one function call.
 * @param {string} str Raw string with commands from the path element
 * @param {number} r Expected radius of the arcs.
 * @param {number} round Number of decimal digits to round values
 * @param {number} [offsetX]
 * @param {number} [offsetY]
 * @returns {string} New commands sequence with rounded corners
 */
function roundCorners(str, r, round, offsetX, offsetY) {
  return roundCommands([...parsePath(str)], r, round, offsetX, offsetY)
}

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

export { parsePath, roundCommands, roundCorners }
