import ArrayList from "../util/ArrayList"

export default interface PolygonInterface {
  m_List: ArrayList

  equals
  hashCode
  toString
  clear
  add
  addPointXY
  addPoint
  addPoly
  isEmpty
  getBounds
  getInnerPoly
  getNumInnerPoly
  getNumPoints
  getX
  getY
  getPoint
  getPoints
  isPointInside
  isHole
  setIsHole
  isContributing
  setContributing
  intersection
  union
  xor
  difference
  getArea

  removeUnnecessaryPoints(): this
}
