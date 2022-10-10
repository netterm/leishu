declare interface HTTPResponseInterface<D = unknown> {
  code: number
  data: D
  message?: string
}
