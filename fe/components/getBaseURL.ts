export const getBaseUrl = () => {
  const isLocal = process.env.NODE_ENV === 'development';
  if (isLocal) {
    return 'http://localhost:3000';
  } else {
    const { origin } = new URL(window.location.href);
    console.log('ORIGIN', origin);
    return origin;
  }
};

export default getBaseUrl;
