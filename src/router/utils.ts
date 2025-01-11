export function parseRoute(path: string) {
  const parts = path.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  
  const pattern = parts.map(part => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = '';
      return '([^/]+)';
    }
    return part;
  }).join('\\/');

  return {
    regex: new RegExp(`^\\/?${pattern}\\/?$`),
    params: Object.keys(params)
  };
}

export function matchRoute(routePath: string, currentPath: string) {
  const { regex, params } = parseRoute(routePath);
  const match = currentPath.match(regex);
  
  if (!match) return null;
  
  const values = match.slice(1);
  const result: Record<string, string> = {};
  
  params.forEach((param, index) => {
    result[param] = values[index];
  });
  
  return result;
}
