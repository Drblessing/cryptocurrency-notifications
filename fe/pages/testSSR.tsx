import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import { useEffect } from 'react';

interface TestProps {
  test: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Test fetching
  const testApi = 'https://randomuser.me/api/';
  const res = await fetch(testApi);
  console.log(process.env.R2_BUCKET_API_KEY);
  const data = await res.json();
  console.log(data.results[0].name.first);
  return {
    props: { test: data.results[0].name.first },
  };
};

export default function TestSSR({ test }: TestProps) {
  return (
    <div>
      <h1>Test SSR</h1>
      <p>{test}</p>
    </div>
  );
}

export const config = { runtime: 'experimental-edge' };
