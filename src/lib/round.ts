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

import { Path } from "./class/Path"
import LineTo from "./class/Command/LineTo"
import CubicCurve from "./class/Command/CubicCurve"
import Point from "../gpc/geometry/Point"
import Close from "./class/Command/Close"

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
export function roundPathCorners(path: Path, radius: number, useFractionalRadius: boolean) {
  const origPointMap = new Map()
  const oldCommands = [...path.commands]

  // The resulting commands, also grouped
  let newCommands = []

  if (oldCommands.length > 1) {
    const startPoint = pointForCommand(oldCommands[0])

    // Handle the close path case with a "virtual" closing line
    let virtualCloseLine = null
    if (
      oldCommands[oldCommands.length - 1].getCommandLetter() === "Z" &&
      oldCommands[0].getParameters().length >= 2
    ) {
      virtualCloseLine = new LineTo(startPoint)
      oldCommands[oldCommands.length - 1] = virtualCloseLine
    }

    // We always use the first command (but it may be mutated)
    newCommands.push(oldCommands[0])

    for (let cmdIndex = 1; cmdIndex < oldCommands.length; cmdIndex++) {
      const prevCmd = newCommands[newCommands.length - 1]
      const curCmd = oldCommands[cmdIndex]

      // Handle closing case
      const nextCmd =
        curCmd === virtualCloseLine ? oldCommands[1] : oldCommands[cmdIndex + 1]

      // Nasty logic to decide if this path is a candidite.
      if (prevCmd instanceof LineTo && nextCmd instanceof LineTo) {
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
        newCommands.push(curCmd)

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
        newCommands.push(curveCmd)
      } else {
        // Pass through oldCommands that don't qualify
        newCommands.push(curCmd)
      }
    }

    // Fix up the starting point and restore the close path if the path was originally closed
    if (virtualCloseLine) {
      const newStartPoint = pointForCommand(newCommands[newCommands.length - 1])
      newCommands.push(new Close())
      adjustCommand(newCommands[0], newStartPoint)
    }
  } else {
    newCommands = oldCommands
  }

  // region Inner functions
  function moveTowardsLength (movingPoint, targetPoint, amount) {
    const width = targetPoint.x - movingPoint.x
    const height = targetPoint.y - movingPoint.y
    const distance = Math.sqrt(width * width + height * height)

    return moveTowardsFractional(
      movingPoint,
      targetPoint,
      Math.min(1, amount / distance),
    )
  }

  function moveTowardsFractional (movingPoint, targetPoint, fraction) {
    return {
      x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
      y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
    }
  }

  // Adjusts the ending position of a command
  function adjustCommand (cmd, newPoint) {
    if (cmd.length > 2) {
      cmd[cmd.length - 2] = newPoint.x
      cmd[cmd.length - 1] = newPoint.y
    }
  }

  // Gives an {x, y} object for a command's ending position
  function pointForCommand (cmd) {
    return cmd.endPoint
  }
  // endregion Inner functions

  return new Path(newCommands)
}
