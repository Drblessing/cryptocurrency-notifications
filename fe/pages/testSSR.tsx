import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';

interface TestProps {
  test: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { test: 'test' },
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
