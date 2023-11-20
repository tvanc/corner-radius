export default interface WatcherInterface {
  get watching(): boolean

  start()

  stop()
}
