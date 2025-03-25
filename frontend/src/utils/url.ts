export const getImageUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  return `${process.env.REACT_APP_API_URL}${path}`;
};

export const getFileUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  return `${process.env.REACT_APP_API_URL}${path}`;
}; 