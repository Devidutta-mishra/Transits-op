const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function getPagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}

export function getSortClause(sortBy, sortOrder, allowedSortFields, fallbackSort) {
  const direction = String(sortOrder || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";
  const column = allowedSortFields[sortBy] || fallbackSort;

  return `${column} ${direction}`;
}

export function buildPagedResult(items, total, page, limit) {
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
