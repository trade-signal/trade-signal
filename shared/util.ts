export const getFilteredParams = (
  searchParams: URLSearchParams,
  paramName: string
) => searchParams.getAll(paramName).filter(item => item.trim());
