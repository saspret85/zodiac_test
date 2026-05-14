export class AppError extends Error {
  constructor(
    public err_code: number,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}
