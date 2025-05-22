import Link from "next/link";

const Layout = () => {
  return (
    <main className="flex flex-col flex-1 gap-8">
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-4 font-bold text-4xl">Hello World</h1>

        <Link href="/docs" className="hover:underline">
          view components
        </Link>
      </div>
    </main>
  );
};

export default Layout;
