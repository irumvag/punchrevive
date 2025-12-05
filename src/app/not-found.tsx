import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-haunted-black">
      <div className="text-center px-4">
        <div className="mb-6">
          <span className="text-6xl">👻</span>
        </div>
        <h2 className="text-4xl font-creepster text-toxic-green mb-4">
          Lost in the Void
        </h2>
        <p className="text-lg font-mono text-dark-green mb-6">
          This page has been consumed by the digital darkness
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 font-mono text-toxic-green border-2 border-toxic-green rounded-lg hover:bg-toxic-green hover:text-haunted-black transition-all duration-300"
        >
          Return to the Crypt
        </Link>
      </div>
    </div>
  );
}
