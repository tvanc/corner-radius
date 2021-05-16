import Point from "./Point"

export default class Rectangle {
  topLeft
  bottomRight

  /**
   * @param {Point} topLeft
   * @param {Point} bottomRight
   */
  constructor(topLeft, bottomRight) {
    this.topLeft = topLeft
    this.bottomRight = bottomRight
  }

  get bottomLeft() {
    return new Point(this.topLeft.x, this.bottomRight.y)
  }

  get topRight() {
    return new Point(this.bottomRight.x, this.topLeft.y)
  }
}
