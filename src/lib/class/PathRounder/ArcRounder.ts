import PathRounderInterface from "./PathRounderInterface"
import { Path } from "../Path"
import LineTo from "../Command/LineTo"
import Point from "../../../gpc/geometry/Point"
import Close from "../Command/Close"
import AbstractLineCommand from "../Command/AbstractLineCommand"
import MoveTo from "../Command/MoveTo"
import { getDistance, pointsAreClockwise } from "../../util"
import Arc from "../Command/Arc"

export default class ArcRounder implements PathRounderInterface {
  roundPath(path: Path, radius: number): Path {
    return roundPathCorners(path, radius)
  }
}

/*****************************************************************************
 * Original license below. The code below is a derivation of the work         *
 * described in the license below. It has been modified from its original     *
 * form, for the purposes of this software.                                   *
 * ========================================================================== *
 *                                                                            *
 *  SVG Path Rounding Function                                                *
 *  Copyright (C) 2014 Yona Appletree                                         *
 *                                                                            *
 *  Licensed under the Apache License, Version 2.0 (the "License");           *
 *  you may not use this file except in compliance with the License.          *
 *  You may obtain a copy of the License at                                   *
 *                                                                            *
 *      https://www.apache.org/licenses/LICENSE-2.0                           *
 *                                                                            *
 *  Unless required by applicable law or agreed to in writing, software       *
 *  distributed under the License is distributed on an "AS IS" BASIS,         *
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 *  See the License for the specific language governing permissions and       *
 *  limitations under the License.                                            *
 *                                                                            *
 *****************************************************************************/

/**
 * SVG Path rounding function. Takes an input path string and outputs a path
 * string where all line-line corners have been rounded. Only supports absolute
 * commands at the moment.
 *
 * @param path The SVG input string, or an array of commands
 * @param maxRadius The amount to round the corners.
 * @returns A new SVG path string with the rounding
 */
function roundPathCorners(path: Path, maxRadius: number) {
  const origPointMap = new Map()
  const originalCommands = [...path.commands]
  const newCommands = [...originalCommands]

  // The resulting commands, also grouped
  let resultCommands = []

  if (newCommands.length > 1) {
    const startPoint = pointForCommand(newCommands[0])
    const [originalFinalCommand] = newCommands.slice(-1)
    const pathIsClosed = originalFinalCommand instanceof Close
    // Handle the close path case with a "virtual" closing line
    const virtualCloseLine = new LineTo(startPoint)
    if (pathIsClosed) {
      newCommands[newCommands.length - 1] = virtualCloseLine
    } else {
      newCommands.push(virtualCloseLine)
    }

    // We always use the first command (but it may be mutated)
    resultCommands.push(newCommands[0])

    for (let cmdIndex = 1; cmdIndex < newCommands.length; cmdIndex++) {
      const prevCmd = resultCommands[resultCommands.length - 1]
      const curCmd = newCommands[cmdIndex]
      const isCloseLine = curCmd === virtualCloseLine

      // Handle closing case
      const nextCmd = isCloseLine ? newCommands[1] : newCommands[cmdIndex + 1]

      // Nasty logic to decide if this path is a candidate.
      const isCandidate =
        prevCmd.endPoint &&
        curCmd instanceof LineTo &&
        nextCmd instanceof LineTo

      const prevPoint = pointForCommand(prevCmd)
      const curPoint = pointForCommand(curCmd)

      if (isCandidate) {
        // Calc the points we're dealing with
        const nextPoint = pointForCommand(nextCmd)
        const distanceToNext = getDistance(curPoint, nextPoint)
        const distanceToPrev = getDistance(prevPoint, curPoint)
        // next point is the last
        const divisor =
          isCloseLine || cmdIndex === newCommands.length - 2 ? 1 : 2

        const minRadius = Math.min(
          maxRadius,
          distanceToPrev,
          distanceToNext / divisor,
        )

        // The start and end of the curve are just our point moved towards the previous and next points, respectively
        const curveStart = moveTowardsLength(curPoint, prevPoint, minRadius)
        const curveEnd = moveTowardsLength(curPoint, nextPoint, minRadius)

        // Adjust the current command and add it
        adjustCommand(curCmd, curveStart)
        origPointMap.set(curCmd, curPoint)
        const distanceToCurveStart = getDistance(prevPoint, curveStart)
        // Points are arranged clockwise, so any counterclockwise corner must be concave
        // we want sweep=true for convex corners, and sweep=false for concave corners
        const sweep = pointsAreClockwise(prevPoint, curPoint, nextPoint)

        if (distanceToCurveStart !== 0) {
          resultCommands.push(curCmd)
        }

        const arc = new Arc(minRadius, minRadius, 0, false, sweep, curveEnd)

        // Save the original point for fractional calculations
        origPointMap.set(arc, curPoint)
        resultCommands.push(arc)
      } else if (getDistance(prevPoint, curPoint)) {
        // Pass through oldCommands that don't qualify
        resultCommands.push(curCmd)
      }
    }

    // Fix up the starting point and restore the close path if the path was originally closed
    if (virtualCloseLine) {
      const newStartPoint = pointForCommand(
        resultCommands[resultCommands.length - 1],
      )
      adjustCommand(resultCommands[0], newStartPoint)
    }

    if (pathIsClosed) {
      resultCommands.push(new Close())
    }

    // Eliminate the first line if a close path would work just as well
    // TODO Rotate path until we can replace a line with a MoveTo...Close
    const firstCommand = resultCommands[0]
    const secondCommand = resultCommands[1]
    const finalCommand = resultCommands[resultCommands.length - 1]
    const finalNonCloseCommand =
      finalCommand instanceof Close
        ? resultCommands[resultCommands.length - 2]
        : finalCommand

    if (
      firstCommand instanceof MoveTo &&
      secondCommand instanceof LineTo &&
      firstCommand.endPoint.x === finalNonCloseCommand.endPoint.x &&
      firstCommand.endPoint.y === finalNonCloseCommand.endPoint.y
    ) {
      resultCommands = resultCommands.slice(2)
      resultCommands.unshift(firstCommand)
      firstCommand.endPoint = secondCommand.endPoint
    }
  } else {
    resultCommands = newCommands
  }

  return new Path(resultCommands)

  // region Inner functions
  function moveTowardsLength(
    movingPoint: Point,
    targetPoint: Point,
    amount: number,
  ) {
    const width = targetPoint.x - movingPoint.x
    const height = targetPoint.y - movingPoint.y
    const distance = Math.sqrt(width ** 2 + height ** 2)
    const fraction = Math.min(1, amount / distance)

    return new Point(
      movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
      movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
    )
  }

  // Adjusts the ending position of a command
  function adjustCommand(cmd, newPoint: Point) {
    if (cmd instanceof AbstractLineCommand) {
      cmd.endPoint = newPoint
    }
  }

  // Gives an {x, y} object for a command's ending position
  function pointForCommand(cmd): Point {
    return cmd.endPoint
  }

  // endregion Inner functions
}
