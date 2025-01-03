export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to Next.js with Tailwind CSS!
      </h1>
      <p className="mt-4 text-gray-700">
        Get started by editing{' '}
        <code className="font-mono text-lg">pages/index.js</code>.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Get Started
      </button>
    </div>
  );
}
