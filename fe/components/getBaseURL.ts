export const getBaseUrl = () => {
  const isLocal = process.env.NODE_ENV === 'development';
  return isLocal
    ? 'http://localhost:3000'
    : 'https://cryptocurrency-notifications.pages.dev';
};

export default getBaseUrl;
