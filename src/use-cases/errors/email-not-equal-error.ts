export class EmailNotEqualError extends Error {
  constructor() {
    super("Not all emails are the same.")
  }
}
