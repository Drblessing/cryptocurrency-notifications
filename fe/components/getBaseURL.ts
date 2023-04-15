export const getBaseUrl = () => {
  const isLocal = process.env.NODE_ENV === 'development';
  if (isLocal) {
    return 'http://localhost:3000';
  } else {
    const { origin } = new URL(window.location.href);
    return origin;
  }
};

export default getBaseUrl;
