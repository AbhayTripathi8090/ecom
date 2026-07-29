type MongoLike = Record<string, unknown>;

export const normalizeMongo = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeMongo(item)) as T;
  }

  if (!value || typeof value !== "object" || value instanceof File) {
    return value;
  }

  const source = value as MongoLike;
  const normalized: MongoLike = {};

  Object.entries(source).forEach(([key, entry]) => {
    normalized[key] = normalizeMongo(entry);
  });

  if (source._id && !source.id) {
    normalized.id = String(source._id);
  }

  return normalized as T;
};
