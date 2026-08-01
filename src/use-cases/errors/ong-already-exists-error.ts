export class OngAlreadyExistsError extends Error {
  constructor() {
    super("E-mail already exists.")
  }
}
