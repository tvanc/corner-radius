/*****************************************************************************
 * Original license below. This file is a derivation of the file of the work  *
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

import { Path } from "../Path"
import LineTo from "../Command/LineTo"
import CubicCurve from "../Command/CubicCurve"
import Point from "../../../gpc/geometry/Point"
import Close from "../Command/Close"
import AbstractLineCommand from "../Command/AbstractLineCommand"
import MoveTo from "../Command/MoveTo"

/**
 * SVG Path rounding function. Takes an input path string and outputs a path
 * string where all line-line corners have been rounded. Only supports absolute
 * commands at the moment.
 *
 * @param path The SVG input string, or an array of commands
 * @param radius The amount to round the corners, either a value in the SVG
 *               coordinate space, or, if useFractionalRadius is true, a value
 *               from 0 to 1.
 * @param useFractionalRadius If true, the curve radius is expressed as a
 *               fraction of the distance between the point being curved and
 *               the previous and next points.
 * @returns A new SVG path string with the rounding
 */
export function roundPathCorners(
  path: Path,
  radius: number,
  useFractionalRadius: boolean,
) {
  const origPointMap = new Map()
  const newCommands = [...path.commands]

  // The resulting commands, also grouped
  let resultCommands = []

  if (newCommands.length > 1) {
    const startPoint = pointForCommand(newCommands[0])

    // Handle the close path case with a "virtual" closing line
    let virtualCloseLine = null
    if (newCommands[newCommands.length - 1] instanceof Close) {
      virtualCloseLine = new LineTo(startPoint)
      newCommands[newCommands.length - 1] = virtualCloseLine
    }

    // We always use the first command (but it may be mutated)
    resultCommands.push(newCommands[0])

    for (let cmdIndex = 1; cmdIndex < newCommands.length; cmdIndex++) {
      const prevCmd = resultCommands[resultCommands.length - 1]
      const curCmd = newCommands[cmdIndex]

      // Handle closing case
      const nextCmd =
        curCmd === virtualCloseLine ? newCommands[1] : newCommands[cmdIndex + 1]
      const isCandidate =
        nextCmd &&
        prevCmd &&
        prevCmd.endPoint &&
        curCmd instanceof LineTo &&
        nextCmd instanceof LineTo

      // Nasty logic to decide if this path is a candidite.
      if (isCandidate) {
        // Calc the points we're dealing with
        const prevPoint = pointForCommand(prevCmd)
        const curPoint = pointForCommand(curCmd)
        const nextPoint = pointForCommand(nextCmd)

        // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
        let curveStart, curveEnd

        if (useFractionalRadius) {
          curveStart = moveTowardsFractional(
            curPoint,
            origPointMap.get(prevCmd) ?? prevPoint,
            radius,
          )
          curveEnd = moveTowardsFractional(
            curPoint,
            origPointMap.get(nextCmd) ?? nextPoint,
            radius,
          )
        } else {
          curveStart = moveTowardsLength(curPoint, prevPoint, radius)
          curveEnd = moveTowardsLength(curPoint, nextPoint, radius)
        }

        // Adjust the current command and add it
        adjustCommand(curCmd, curveStart)
        origPointMap.set(curCmd, curPoint)
        resultCommands.push(curCmd)

        // The curve control points are halfway between the start/end of the curve and
        // the original point
        const startControl = moveTowardsFractional(curveStart, curPoint, 0.5)
        const endControl = moveTowardsFractional(curPoint, curveEnd, 0.5)

        // Create the curve
        const curveCmd = new CubicCurve(
          new Point(startControl.x, startControl.y),
          new Point(endControl.x, endControl.y),
          new Point(curveEnd.x, curveEnd.y),
        )

        // Save the original point for fractional calculations
        origPointMap.set(curveCmd, curPoint)
        resultCommands.push(curveCmd)
      } else {
        // Pass through oldCommands that don't qualify
        resultCommands.push(curCmd)
      }
    }

    // Fix up the starting point and restore the close path if the path was originally closed
    if (virtualCloseLine) {
      const newStartPoint = pointForCommand(
        resultCommands[resultCommands.length - 1],
      )
      resultCommands.push(new Close())
      adjustCommand(resultCommands[0], newStartPoint)
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
    const distance = Math.sqrt(width * width + height * height)

    return moveTowardsFractional(
      movingPoint,
      targetPoint,
      Math.min(1, amount / distance),
    )
  }

  function moveTowardsFractional(
    movingPoint: Point,
    targetPoint: Point,
    fraction: number,
  ) {
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
