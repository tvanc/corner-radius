import Point from "./Point.js"
import ArrayHelper from "../util/ArrayHelper.js"

export default class EdgeNode {
  /** Piggy-backed contour vertex data */
  vertex = new Point()

  /** Edge lower (x, y) coordinate */
  bot = new Point()

  /** Edge upper (x, y) coordinate */
  top = new Point()

  /** Scanbeam bottom x coordinate */
  xb

  /** Scanbeam top x coordinate */
  xt

  /** Change in x for a unit y increase */
  dx

  /** Clip / subject edge flag */
  type

  /** Bundle edge flags */
  bundle = ArrayHelper.create2DArray(2)

  /** Bundle left / right indicators */
  bside = []

  /** Edge bundle state */
  bstate = []

  /** Output polygon / tristrip pointer */
  outp = []

  /** Previous edge in the AET */
  prev

  /** Next edge in the AET */
  next

  /** Edge connected at the lower end */
  pred

  /** Edge connected at the upper end */
  succ

  /** Pointer to next bound in LMT */
  next_bound
}
