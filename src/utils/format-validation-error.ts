import type { ZodError } from "zod"

type ValidationIssue = ZodError["issues"][number]

function formatPath(path: ValidationIssue["path"]) {
  return path.reduce<string>((field, segment) => {
    if (typeof segment === "number") {
      return `${field}[${segment}]`
    }

    return field ? `${field}.${String(segment)}` : String(segment)
  }, "")
}

function formatOptions(values: readonly unknown[]) {
  const options = values.map((value) => String(value))

  if (options.length <= 1) {
    return options.join("")
  }

  return `${options.slice(0, -1).join(", ")} or ${options.at(-1)}`
}

function formatMessage(issue: ValidationIssue) {
  switch (issue.code) {
    case "invalid_value":
      return `Invalid value. Expected one of: ${formatOptions(issue.values)}.`

    case "invalid_type":
      return issue.message.endsWith("received undefined")
        ? "This field is required."
        : `Invalid type. Expected ${issue.expected}.`

    case "invalid_format":
      return `Invalid ${issue.format} format.`

    case "too_small":
      return issue.origin === "string"
        ? `Must contain at least ${issue.minimum} character(s).`
        : `Must contain at least ${issue.minimum} item(s).`

    case "too_big":
      return issue.origin === "string"
        ? `Must contain at most ${issue.maximum} character(s).`
        : `Must contain at most ${issue.maximum} item(s).`

    case "unrecognized_keys":
      return `Unrecognized field(s): ${issue.keys.join(", ")}.`

    default:
      return issue.message
  }
}

export function formatValidationError(error: ZodError) {
  return {
    message: "Validation error.",
    issues: error.issues.map((issue) => ({
      field: formatPath(issue.path) || "body",
      message: formatMessage(issue),
    })),
  }
}
