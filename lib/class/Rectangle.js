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
}
