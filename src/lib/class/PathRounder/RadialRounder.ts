import PathRounderInterface from "./PathRounderInterface"
import { Path } from "../Path"
import { roundPathCorners } from "./round"

export default class RadialRounder implements PathRounderInterface {
  roundPath(path: Path, radius: number): Path {
    return roundPathCorners(path, radius)
  }
}
