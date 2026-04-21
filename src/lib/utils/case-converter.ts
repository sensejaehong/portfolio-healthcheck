// snake_case <-> camelCase converter utility

function toCamelCaseKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toSnakeCaseKey(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

export function toCamelCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as unknown as T;
  }

  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[toCamelCaseKey(key)] = toCamelCase(value);
    }
    return result as T;
  }

  return obj as T;
}

export function toSnakeCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as unknown as T;
  }

  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[toSnakeCaseKey(key)] = toSnakeCase(value);
    }
    return result as T;
  }

  return obj as T;
}
