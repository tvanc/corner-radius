import { Path } from "../Path"

export default interface PathRounderInterface {
  roundPath(path: Path, radius: number): Path
}
