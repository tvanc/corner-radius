import { CommandSet } from "./CommandSet"

export function simplifyPathCommands(originalCommandSet: CommandSet) {
  const newCommands = []
  let lines

  for (const [type, ...parameters] of originalCommandSet.commands) {
  }

  return new CommandSet(newCommands)
}

/**
 * @param segments
 * Array of array of numbers
 */
function combineOverlappingLines(segments: number[][]) {
  segments = [
    [1, 1, 2, 1],
    [2, 1, 2, 2],
    [2, 2, 3, 2],
    [3, 2, 3, 1],
    [3, 1, 1, 1],
  ]

  //  Function determines if segment between coordinates (a,b) completely overlaps
  //  the segment between coordinates (y,z)
  function completelyOverlaps(aStart, aEnd, bStart, bEnd) {
    return (
      // line A includes line B
      (aStart <= bStart && aStart <= bEnd && aEnd >= bStart && aEnd >= bEnd) ||
      // line B includes line A
      (aEnd <= bStart && aEnd <= bEnd && aStart >= bStart && aStart >= bEnd)
    )
  }

  const overlapped = []
  for (let i = 0; i < segments.length; ++i) {
    for (let j = i + 1; j < segments.length; ++j) {
      const [x1, y1, x2, y2] = segments[i]
      const [x3, y3, x4, y4] = segments[j]

      // Checks whether the cross product between two different pairs of points
      // are both == 0, which means that the segments are both on the same line
      if (
        crossProduct([x1 - x2, y1 - y2], [x3 - x4, y3 - y4]) == 0 &&
        crossProduct([x1 - x2, y1 - y2], [x3 - x1, y3 - y1]) == 0
      ) {
        // If lines are vertical, consider the y-coordinates
        if (x1 === x2) {
          // If 1st segment fully overlaps 2nd, add latter to the list
          if (completelyOverlaps(y1, y2, y3, y4)) {
            overlapped.push(segments[j])
          }
          // If 2nd segment fully overlaps 1st, add latter to the list
          else if (completelyOverlaps(y3, y4, y1, y2)) {
            overlapped.push(segments[i])
          }
        }
        // In all other cases, consider the x-coordinates
        else {
          if (completelyOverlaps(x1, x2, x3, x4)) {
            overlapped.push(segments[j])
          } else if (completelyOverlaps(x3, x4, x1, x2)) {
            overlapped.push(segments[i])
          }
        }
      }
    }
  }

  // original python expression: segments = [s for s in segments if s not in overlapped]
  return segments.filter((segment: number[]) => !overlapped.includes(segment))
}

function crossProduct([v1x, v1y], [v2x, v2y]): Number {
  return v1x * v2y - v1y * v2x
}
