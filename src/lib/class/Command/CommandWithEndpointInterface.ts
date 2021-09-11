import CommandInterface from "./CommandInterface"
import Point from "../../../gpc/geometry/Point"

export default interface CommandWithEndpointInterface extends CommandInterface {
  endPoint: Point
}
