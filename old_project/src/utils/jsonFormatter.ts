export function formatJson(json: string): string {
  if (!json.trim()) {
    return '';
  }
  
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function isValidJson(json: string): boolean {
  if (!json.trim()) {
    return true;
  }
  
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}