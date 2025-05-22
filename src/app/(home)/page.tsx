import { Header, Layout } from "@/components/layout";

const Home = () => {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <Header />
      <Layout />
    </div>
  );
};

export default Home;
